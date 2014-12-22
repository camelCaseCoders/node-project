function UserError(message) {
	this.message = message;
}
UserError.prototype = Object.create(Error.prototype);

function ServerError(message) {
	this.message = message;
}
ServerError.prototype = Object.create(Error.prototype);

function AuthorizationError(message) {
	this.message = message;
}
AuthorizationError.prototype = Object.create(Error.prototype);

function ValidationError(message) {
	this.message = message;
}
ValidationError.prototype = Object.create(Error.prototype);

module.exports = {
	UserError: UserError,
	ServerError: ServerError,
	ValidationError: ValidationError,
	notFound: new UserError('Not found'),
	AuthorizationError: AuthorizationError,
	notLoggedInError: new AuthorizationError('Not logged in'),
	notAuthorized: new AuthorizationError('Not authorized'),
};