import { hashPassword } from './password.js'

export type Credentials = {username: string, hashedPassword: string}

function makeCredentials(username:string, password:string): Credentials {
	return {username: username, hashedPassword: hashPassword(username, password)}
}

function loginLocal(credentials:Credentials): void {
	localStorage.setItem('campaignUsername', credentials.username)
	localStorage.setItem('hashedPassword', credentials.hashedPassword)
}



function getCredentials(): Credentials|null {
	const username = localStorage.campaignUsername
	const hashedPassword = localStorage.hashedPassword
	if (username !== null && hashedPassword !== null) {
		return {
			username:username,
			hashedPassword:hashedPassword
		}
	} else {
		return null
	}
}
//TODO: handle bad login information
async function load() {
	const credentials:Credentials|null = getCredentials()
	if (credentials === null) {
		displayLogin()
	} else {
		const levels = await getUnlockedLevels(credentials)
		for (const [name, url] of levels.entries()) {
			$(`#${name}`).attr('href', `play?${url}`)
		}
	}
}

async function loginRemote(credentials:Credentials): Promise<boolean> {
	return new Promise(resolve => {
		$.get(`login?${credentialParams(credentials)}`, function(data) {
			console.log(data)
			//TODO use the endpoint to actually figure out if they are logged in
			resolve(true)
		})
	})
}

async function signupRemote(credentials:Credentials): Promise<boolean> {
	return new Promise(resolve => {
		$.get(`signup?${credentialParams(credentials)}`, function(data) {
			console.log(data)
			//TODO use the endpoint to actually figure out if they are logged in
			resolve(true)
		})
	})
}

function displayLogin() {
    $('#loginDialog').html(
        `<label for="username">Name:</label>` +
        `<textarea id="username"></textarea>` +
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
    		$('#username').val() as string, 
    		$('#password').val() as string
		)
    }
    function exit() {
        $('#scoreSubmitter').attr('active', 'false')
    }
    async function login() {
    	const credentials = credentialsFromForm();
    	if (credentials !== null) {
	    	const success = await loginRemote(credentials)
	    	if (success) {
	    		loginLocal(credentials)
	    		exit();
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
	    	} else {
	    		alert('Error signing up')
	    	}
    	}
    }
}

function credentialParams(credentials:Credentials): string {
	return `username=${credentials.username}&hashedPassword=${credentials.hashedPassword}`
}

async function getUnlockedLevels(credentials:Credentials): Promise<[string, string][]> {
	return new Promise(resolve => {
		$.get(`unlockedLevels?${credentialParams(credentials)}`, function(data) {
			console.log(data)
			//TODO: resolve with the right thing
			resolve(data)
		})
	})
}

