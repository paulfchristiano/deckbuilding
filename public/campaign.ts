export type Credentials = {username: string, hashedPassword: string}

function makeCredentials(username:string, password:string): Credentials {
	return {username: username, hashedPassword: hashPassword(username, password)}
}

function loginLocal(credentials:Credentials): void {
	localStorage.setItem('campaignUsername', credentials.username)
	localStorage.setItem('hashedPassword', credentials.hashedPassword)
}

function logout() {
	delete localStorage.campaignUsername
	delete localStorage.hashedPassword
}

function escapePeriods(id:string): string {
	return id.replace('.', '\\.')
}

export function getCredentials(): Credentials|null {
	const username = localStorage.campaignUsername
	const hashedPassword = localStorage.hashedPassword
	if (username !== undefined && hashedPassword !== undefined) {
		return {
			username:username,
			hashedPassword:hashedPassword
		}
	} else {
		return null
	}
}

export interface CampaignInfo {
	urls: [string, string|null][], //list of level names -> level urls
	lockReasons: [string, string][],
	scores: [string, number|null][], //scores per level
	awardsByLevel: [string, number][],
	numAwards: number,
	maxStars: number,
	availableAwardsByLevel: [string, number][],
}

function toggleRules() {
	const active = $('#rules').attr('active')
	console.log(active)
	$('#rules').attr('active', (active == 'true') ? 'false' : 'true')
}

export async function load() {
	const credentials:Credentials|null = getCredentials()
	$('#logoutButton').click(logout)
	if (credentials !== null) $('#namespan').text(credentials.username)
	$('#showRules').unbind('click')
	$('#showRules').click(toggleRules)
	if (credentials === null) {
		displayLogin()
	} else {
		const lookupAwardsByLevel = new Map<string, number>()
		const info = await getCampaignInfo(credentials)
		$('#numAwards').text(` ${info.numAwards}`)
		for (const [name, url] of info.urls) {
			if (url !== null) {
				$(`#${$.escapeSelector(name)} a`).attr('href', `play?campaign&${url}`)
			}
		}
		for (const [name, reason] of info.lockReasons) {
			$(`#${$.escapeSelector(name)} .req`).html(` (&#128274;${reason})`)
		}
		for (const [name, awards] of info.awardsByLevel) {
			$(`#${$.escapeSelector(name)} .stars`).text(renderStars(awards))
			lookupAwardsByLevel.set(name, awards)
		}
		for (const [name, awards] of info.availableAwardsByLevel) {
			console.log([name, awards])
			if (awards >= 4 && (lookupAwardsByLevel.get(name) || 0) < awards){
				$(`#${$.escapeSelector(name)}`).append(' [!]')
			}
		}
		displayStarUnlocks(info.maxStars)
	}
}

function displayStarUnlocks(maxStars:number): void {
	if (maxStars >= 2) {
		$('#unlock1').html(`You've unlocked a second star on each level!`)
	}
	if (maxStars >= 3) {
		$('#unlock2').html("You've unlocked a third star on each level!")
	}
	if (maxStars >= 4) {
		$('#unlock3').html(`You've unlocked a hidden fourth star on some levels!
			Levels with a fourth star available are marked with [!]`)
	}
}

function renderStars(n:number): string {
	if (n == 0) return ''
	return `(${Array(n).fill('*').join('')})`

}

function loginRemote(credentials:Credentials): Promise<boolean> {
	return new Promise(resolve => {
		$.post(`login?${credentialParams(credentials)}`, function(data) {
			if (data != 'ok') {
				resolve(false)
			} else {
				resolve(true)
			}
		})
	})
}

function signupRemote(credentials:Credentials): Promise<boolean> {
	return new Promise(resolve => {
		if (credentials.username == '') {
			alert('Enter a username and password and click signup')
		} else {
			$.post(`signup?${credentialParams(credentials)}`, function(data) {
				if (data != 'ok') {
					resolve(false)
				} else {
					resolve(true)
				}
			})
		}
	})
}

function displayLogin() {
    $('#loginDialog').html(
        `<label for="name">Name:</label>` +
        `<input type='text' id="name"></textarea>` +
        `<div>` +
        `<label for="password">Password:</label>` +
        `<input type='password' id="password"></textarea>` +
        `</div>` +
        `<div>` +
        `<span class="option" choosable id="signup">Sign up</span>` +
        `<span class="option" choosable id="login">Log in</span>` +
        `</div>`
    )
    //TODO: alert when credentials are no good
    function credentialsFromForm(): Credentials|null {
    	return makeCredentials(
    		$('#name').val() as string, 
    		$('#password').val() as string
		)
    }
    function exit() {
    	$('#loginDialog').html('')
    	$('#loginDialog').attr('active', 'false')
    }
    async function login() {
    	const credentials = credentialsFromForm();
    	if (credentials !== null) {
	    	const success = await loginRemote(credentials)
	    	if (success) {
	    		loginLocal(credentials)
	    		exit();
	    		load();
	    	} else {
	    		alert('No existing user found with that name+password')
	    	}
    	}
    }
    async function signup() {
    	const credentials = credentialsFromForm();
    	if (credentials !== null) {
	    	const success = await signupRemote(credentials)
    		//TODO actually do things the right way with errors etc.
	    	if (success) {
	    		loginLocal(credentials)
	    		exit();
	    		load();
	    	} else {
	    		alert('Error signing up (probably someone else has that username)')
	    	}
    	}
    }
    $('#loginDialog').attr('active', 'true')
    $('.option[id="login"]').click(login)
    $('.option[id="signup"]').click(signup)
}

function credentialParams(credentials:Credentials): string {
	return `username=${credentials.username}&hashedPassword=${credentials.hashedPassword}`
}

function isCheating(): boolean {
	const search = new URLSearchParams(window.location.search);
	return search.get('cheat') !== null

}

async function getCampaignInfo(
	credentials:Credentials
): Promise<CampaignInfo> {
	const cheatStr = isCheating() ? '&cheat' : ''
	return new Promise((resolve, reject) => {
		$.get(
			`campaignInfo?${credentialParams(credentials)}${cheatStr}`,
			function(data:CampaignInfo|'error') {
				if (data == 'error') {
					alert('invalid credentials')
					logout()
					reject()
					return
				}
				//TODO: resolve with the right thing
				resolve(data)
			})
	})
}

//this is intended only to prevent dev from seeing plaintext passwords
//(hopefully no users reuse passwords anyway, but might as well)

export function hashPassword(username:string, password:string ):string {
	return hash(password).toString(16)
}

// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s:string):number{
    var hash:number = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash<<5)-hash)+s.charCodeAt(i)
    }
    return hash
}
