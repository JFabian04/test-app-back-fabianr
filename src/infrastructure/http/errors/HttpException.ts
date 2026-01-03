export class HttpException extends Error {
	constructor(
		public status: number,
		public message: string,
		public errorCode?: string
	) {
		super(message);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpException);
		}
	}
}
