function UserError(message) {
	this.message = message;
}
UserError.prototype = Object.create(Error.prototype);
UserError.prototype.status = 400;

function ServerError(message) {
	this.message = message;
}
ServerError.prototype = Object.create(Error.prototype);
ServerError.prototype.status = 500;

function AuthorizationError(message) {
	this.message = message;
}
AuthorizationError.prototype = Object.create(Error.prototype);
AuthorizationError.prototype.status = 401;

function ValidationError(message) {
	this.message = message;
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.status = 406;

module.exports = {
	UserError: UserError,
	ServerError: ServerError,
	ValidationError: ValidationError,
	notFound: new UserError('Not found'),
	AuthorizationError: AuthorizationError,
	notLoggedInError: new AuthorizationError('Not logged in'),
	notAuthorized: new AuthorizationError('Not authorized'),
};