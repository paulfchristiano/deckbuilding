import md5 from 'md5';
export function hashPassword(username, password) {
    return md5("engine-game." + username + "." + password);
}
//# sourceMappingURL=password.js.map