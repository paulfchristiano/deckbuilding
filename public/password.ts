import md5 from 'md5'

export function hashPassword(username:string, password:string):string {
	return md5(`engine-game.${username}.${password}`)
}