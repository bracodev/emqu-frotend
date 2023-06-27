export const VALID_ERROR_CODES = [
  400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412,
  413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 426, 428,
  429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 511
]

// Contains error code -> class mapping
const CODE_CLASSES = []
const MESSAGES = []

const DEFAULT_STATUS_CODE = 500
const DEFAULT_REASON_CODE = 'Internal Server Error'
// eslint-disable-line max-len
const DEFAULT_ERROR_MESSAGE = 'The server encountered an unexpected condition that prevented it from fulfilling the request'

export function HttpErrorMessage (code) {
  if (VALID_ERROR_CODES.find(item => item == code)) { return MESSAGES[code] }
}

/**
 * The HttpError class extends the Error object, providing Http status
 * code and message detail. Pass it an HttpErrorOptions object, a status
 * code, an error message, or an Error object.
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
  isHttpError = true
  statusCode;
  title;
  body;
  message;

  constructor (...params) {
    super(...params)

    this.statusCode = DEFAULT_STATUS_CODE
    this.title = DEFAULT_REASON_CODE
    this.message = DEFAULT_ERROR_MESSAGE

    Object.assign(this, parseErrorOptions(...params))
    if (!this.body && this.statusCode < 500) {
      this.body = {
        // eslint-disable-next-line camelcase
        error_text: this.message || DEFAULT_ERROR_MESSAGE
      }
    }
  }

  get status () {
    return this.statusCode
  }
}

/**
 * Returns HttpError options parsed from the provided parameters
 *
 * @param errorOptions
 * @returns HttpErrorOptions
 */
export const parseErrorOptions = (...errorOptions) => {
  let options = {}

  errorOptions.map(opt => {
    if (opt) {
      if (typeof opt === 'string' || typeof opt === 'number') {
        const statusCode = getStatusCode(opt)
        if (statusCode) {
          options.statusCode = statusCode
        } else if (typeof opt === 'string') {
          options.message = opt
        }
      } else if (opt instanceof Error || hasKeys(opt)) {
        options = {
          ...options,
          ...getErrorProperties(opt)
        }
      }
    }
  })
  return options
}

/**
 * Extracts HttpErrorOptions properties from obj
 *
 * @param obj
 */
const getErrorProperties = (obj) => {
  const returnObj = {}
  if ((isObj(obj) && hasKeys(obj)) || isErr(obj)) {
    const {
      name, title, message, detail,
      stack, type, statusCode, body
    } = obj
    if (isString(name)) {
      returnObj.name = name
    }
    if (isString(title)) {
      returnObj.title = title
    }
    if (isString(message)) {
      returnObj.message = message
    }
    if (isString(detail)) {
      returnObj.detail = detail
    }
    if (isString(stack)) {
      returnObj.stack = stack
    }
    if (isString(type)) {
      returnObj.type = type
    }
    if (statusCode && isNumber(statusCode)) {
      returnObj.statusCode = statusCode
    }
    if (body && (isString(body) || isObj(body))) {
      returnObj.body = body
    }
  }
  return returnObj
}

/* ******************************
  Extended classes for specific errors
  *********************************** */

/**
 * Internal Server Error
 *
 * The server has encountered a situation it doesn't know
 * how to handle.
 *
 */
export class InternalServerError extends HttpError {
  constructor (...options) {
    super(parseErrorOptions(INTERNAL_SERVER_ERROR, ...options))
  }
}
CODE_CLASSES['500'] = InternalServerError
const INTERNAL_SERVER_ERROR = {
  statusCode: 500,
  message: 'The server has encountered a situation it doesn\'t know how to handle.',
  title: 'Internal Server Error',
  type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500'
}
MESSAGES[500] = INTERNAL_SERVER_ERROR

/**
 * Bad Request
 *
 * The server cannot or will not process the request
 * because the received syntax is invalid, nonsensical, or
 * exceeds some limitation on what the server is willing
 * to process.
 *
 */
export class BadRequest extends HttpError {
  constructor (...options) {
    super(parseErrorOptions(BADREQUEST, ...options))
  }
}
CODE_CLASSES['400'] = BadRequest
const BADREQUEST = {
  statusCode: 400,
  message: 'El servidor no puede o no procesará la solicitud porque la sintaxis recibida no es válida, no tiene sentido o excede alguna limitación sobre lo que el servidor está dispuesto a procesar.',
  title: 'Bad Request',
  type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400'
}
MESSAGES[400] = BADREQUEST

/**
 * Unauthorized
 *
 * The request has not been applied because it lacks valid
 * authentication credentials for the target resource.
 *
 */
export class Unauthorized extends HttpError {
  constructor (...options) {
    super(parseErrorOptions(UNAUTHORIZED, ...options))
  }
}
CODE_CLASSES['401'] = Unauthorized
const UNAUTHORIZED = {
  statusCode: 401,
  message: 'La solicitud no se ha aplicado porque carece de credenciales de autenticación válidas para el recurso de destino.',
  title: 'Unauthorized',
  type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401'
}
MESSAGES[401] = UNAUTHORIZED

/**
 * Forbidden
 *
 * The server understood the request but refuses to
 * authorize it.
 *
 */
export class Forbidden extends HttpError {
  constructor (...options) {
    super(parseErrorOptions(FORBIDDEN, ...options))
  }
}
CODE_CLASSES['403'] = Forbidden
const FORBIDDEN = {
  statusCode: 403,
  message: 'El servidor entendió la solicitud pero se niega a autorizarla.',
  title: 'Forbidden',
  type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403'
}
MESSAGES[403] = FORBIDDEN

/**
 * Not Found
 *
 * The origin server did not find a current representation
 * for the target resource or is not willing to disclose
 * that one exists.
 *
 */
export class NotFound extends HttpError {
  constructor (...options) {
    super(parseErrorOptions(NOTFOUND, ...options))
  }
}
CODE_CLASSES['404'] = NotFound
const NOTFOUND = {
  statusCode: 404,
  message: 'El servidor de origen no encontró una representación actual para el recurso de destino o no está dispuesto a revelar que existe.',
  title: 'Not Found',
  type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404'
}
MESSAGES[404] = NOTFOUND

/**
 * Method Not Allowed
 *
 * The method specified in the request-line is known by
 * the origin server but not supported by the target
 * resource.
 *
 */
export class MethodNotAllowed extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 405,
      message: 'The method specified in the request-line is known by the origin server but not supported by the target resource.',
      title: 'Method Not Allowed',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405'
    }, ...options))
  }
}
CODE_CLASSES['405'] = MethodNotAllowed

/**
 * Not Acceptable
 *
 * The target resource does not have a current
 * representation that would be acceptable to the user
 * agent, according to the proactive negotiation header
 * fields received in the request, and the server is
 * unwilling to supply a default representation.
 *
 */
export class NotAcceptable extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 406,
      message: 'The target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request, and the server is unwilling to supply a default representation.',
      title: 'Not Acceptable',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406'
    }, ...options))
  }
}
CODE_CLASSES['406'] = NotAcceptable

/**
 * Proxy Authentication Required
 *
 * Is similar to 401 (Unauthorized), but the client needs
 * to authenticate itself in order to use a proxy.
 *
 */
export class ProxyAuthenticationRequired extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 407,
      message: 'Is similar to 401 (Unauthorized), but the client needs to authenticate itself in order to use a proxy.',
      title: 'Proxy Authentication Required',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407'
    }, ...options))
  }
}
CODE_CLASSES['407'] = ProxyAuthenticationRequired

/**
 * Request Timeout
 *
 * The server did not receive a complete request message
 * within the time that it was prepared to wait.
 *
 */
export class RequestTimeout extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 408,
      message: 'The server did not receive a complete request message within the time that it was prepared to wait.',
      title: 'Request Timeout',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408'
    }, ...options))
  }
}
CODE_CLASSES['408'] = RequestTimeout

/**
 * Conflict
 *
 * The request could not be completed due to a conflict
 * with the current state of the resource.
 *
 */
export class Conflict extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 409,
      message: 'The request could not be completed due to a conflict with the current state of the resource.',
      title: 'Conflict',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409'
    }, ...options))
  }
}
CODE_CLASSES['409'] = Conflict

/**
 * Gone
 *
 * Indicates that access to the target resource is no
 * longer available at the origin server and that this
 * condition is likely to be permanent.
 *
 */
export class Gone extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 410,
      message: 'Indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent.',
      title: 'Gone',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410'
    }, ...options))
  }
}
CODE_CLASSES['410'] = Gone

/**
 * Length Required
 *
 * The server refuses to accept the request without a
 * defined Content-Length.
 *
 */
export class LengthRequired extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 411,
      message: 'The server refuses to accept the request without a defined Content-Length.',
      title: 'Length Required',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411'
    }, ...options))
  }
}
CODE_CLASSES['411'] = LengthRequired

/**
 * Precondition Failed
 *
 * Indicates that one or more preconditions given in the
 * request header fields evaluated to false when tested on
 * the server.
 *
 */
export class PreconditionFailed extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 412,
      message: 'Indicates that one or more preconditions given in the request header fields evaluated to false when tested on the server.',
      title: 'Precondition Failed',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412'
    }, ...options))
  }
}
CODE_CLASSES['412'] = PreconditionFailed

/**
 * Payload Too Large
 *
 * The server is refusing to process a request because the
 * request payload is larger than the server is willing or
 * able to process.
 *
 */
export class PayloadTooLarge extends HttpError {
  constructor (...options) {
    super(parseErrorOptions(PAYLOADTOOLARGE, ...options))
  }
}
CODE_CLASSES['413'] = PayloadTooLarge
const PAYLOADTOOLARGE = {
  statusCode: 413,
  message: 'El archivo que está intentando subir tiene un peso mayor del permitido.',
  title: 'Payload Too Large',
  type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413'
}
MESSAGES[413] = PAYLOADTOOLARGE

/**
 * URI Too Long
 *
 * The server is refusing to service the request because
 * the request-target is longer than the server is willing
 * to interpret.
 *
 */
export class URITooLong extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 414,
      message: 'The server is refusing to service the request because the request-target is longer than the server is willing to interpret.',
      title: 'URI Too Long',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414'
    }, ...options))
  }
}
CODE_CLASSES['414'] = URITooLong

/**
 * Unsupported Media Type
 *
 * The origin server is refusing to service the request
 * because the payload is in a format not supported by the
 * target resource for this method.
 *
 */
export class UnsupportedMediaType extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 415,
      message: 'The origin server is refusing to service the request because the payload is in a format not supported by the target resource for this method.',
      title: 'Unsupported Media Type',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415'
    }, ...options))
  }
}
CODE_CLASSES['415'] = UnsupportedMediaType

/**
 * Range Not Satisfiable
 *
 * Indicates that none of the ranges in the request's
 * Range header field overlap the current extent of the
 * selected resource or that the set of ranges requested
 * has been rejected due to invalid ranges or an excessive
 * request of small or overlapping ranges.
 *
 */
export class RangeNotSatisfiable extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 416,
      message: 'Indicates that none of the ranges in the request\'s Range header field overlap the current extent of the selected resource or that the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges.',
      title: 'Range Not Satisfiable',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416'
    }, ...options))
  }
}
CODE_CLASSES['416'] = RangeNotSatisfiable

/**
 * Expectation Failed
 *
 * The expectation given in the request's Expect header
 * field could not be met by at least one of the inbound
 * servers.
 *
 */
export class ExpectationFailed extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 417,
      message: 'The expectation given in the request\'s Expect header field could not be met by at least one of the inbound servers.',
      title: 'Expectation Failed',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417'
    }, ...options))
  }
}
CODE_CLASSES['417'] = ExpectationFailed

/**
 * I'm a teapot
 *
 * Any attempt to brew coffee with a teapot should result
 * in the error code 418 I'm a teapot.
 *
 */
export class ImATeapot extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 418,
      message: 'Any attempt to brew coffee with a teapot should result in the error code 418 I\'m a teapot.',
      title: 'I\'m a teapot',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418'
    }, ...options))
  }
}
CODE_CLASSES['418'] = ImATeapot

/**
 * Misdirected request
 *
 * The request was directed at a server that is not able
 * to produce a response.  This can be sent by a server
 * that is not configured to produce responses for the
 * combination of scheme and authority that are included
 * in the request URI.
 *
 */
export class MisdirectedRequest extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 421,
      message: 'The request was directed at a server that is not able to produce a response.  This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.',
      title: 'Misdirected request',
      type: 'https://tools.ietf.org/html/rfc7540#section-9.1.2'
    }, ...options))
  }
}
CODE_CLASSES['421'] = MisdirectedRequest

/**
 * Unprocessable Entity
 *
 * Means the server understands the content type of the
 * request entity (hence a 415(Unsupported Media Type)
 * status code is inappropriate), and the syntax of the
 * request entity is correct (thus a 400 (Bad Request)
 * status code is inappropriate) but was unable to process
 * the contained instructions.
 *
 */
export class UnprocessableEntity extends HttpError {
  constructor (...options) {
    super(parseErrorOptions(UNPROCESSABLEENTITY, ...options))
  }
}
CODE_CLASSES['422'] = UnprocessableEntity
const UNPROCESSABLEENTITY = {
  statusCode: 422,
  message: 'Means the server understands the content type of the request entity (hence a 415(Unsupported Media Type) status code is inappropriate), and the syntax of the request entity is correct (thus a 400 (Bad Request) status code is inappropriate) but was unable to process the contained instructions.',
  title: 'Unprocessable Entity',
  type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422'
}
MESSAGES[422] = INTERNAL_SERVER_ERROR

/**
 * Locked
 *
 * Means the source or destination resource of a method is
 * locked.
 *
 */
export class Locked extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 423,
      message: 'Means the source or destination resource of a method is locked.',
      title: 'Locked',
      type: 'https://tools.ietf.org/html/rfc2518#section-10.4'
    }, ...options))
  }
}
CODE_CLASSES['423'] = Locked

/**
 * Failed Dependency
 *
 * Means that the method could not be performed on the
 * resource because the requested action depended on
 * another action and that action failed.
 *
 */
export class FailedDependency extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 424,
      message: 'Means that the method could not be performed on the resource because the requested action depended on another action and that action failed.',
      title: 'Failed Dependency',
      type: 'https://tools.ietf.org/html/rfc2518#section-10.5'
    }, ...options))
  }
}
CODE_CLASSES['424'] = FailedDependency

/**
 * Too Early
 *
 * The server is unwilling to risk processing a request
 * that might be replayed
 *
 */
export class TooEarly extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 426,
      message: 'The server is unwilling to risk processing a request that might be replayed',
      title: 'Too Early',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425'
    }, ...options))
  }
}
CODE_CLASSES['426'] = TooEarly

/**
 * Upgrade Required
 *
 * The server refuses to perform the request using the
 * current protocol but might be willing to do so after
 * the client upgrades to a different protocol.
 *
 */
export class UpgradeRequired extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 426,
      message: 'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.',
      title: 'Upgrade Required',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426'
    }, ...options))
  }
}
CODE_CLASSES['426'] = UpgradeRequired

/**
 * Precondition Required
 *
 * The origin server requires the request to be
 * conditional.
 *
 */
export class PreconditionRequired extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 428,
      message: 'The origin server requires the request to be conditional.',
      title: 'Precondition Required',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428'
    }, ...options))
  }
}
CODE_CLASSES['428'] = PreconditionRequired

/**
 * Too Many Requests
 *
 * The user has sent too many requests in a given amount
 * of time ("rate limiting").
 *
 */
export class TooManyRequests extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 429,
      message: 'The user has sent too many requests in a given amount of time.',
      title: 'Too Many Requests',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429'
    }, ...options))
  }
}
CODE_CLASSES['429'] = TooManyRequests

/**
 * Request Header Fields Too Large
 *
 * The server is unwilling to process the request because
 * its header fields are too large.
 *
 */
export class RequestHeaderFieldsTooLarge extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 431,
      message: 'The server is unwilling to process the request because its header fields are too large.',
      title: 'Request Header Fields Too Large',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431'
    }, ...options))
  }
}
CODE_CLASSES['431'] = RequestHeaderFieldsTooLarge

/**
 * Unavailable For Legal Reasons
 *
 * This request may not be serviced in the Roman Province
 * of Judea due to the Lex Julia Majestatis, which
 * disallows access to resources hosted on servers deemed
 * to be operated by the People's Front of Judea.
 *
 */
export class UnavailableForLegalReasons extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 451,
      message: 'This request may not be serviced in the Roman Province of Judea due to the Lex Julia Majestatis, which disallows access to resources hosted on servers deemed to be operated by the People\'s Front of Judea.',
      title: 'Unavailable For Legal Reasons',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451'
    }, ...options))
  }
}
CODE_CLASSES['451'] = UnavailableForLegalReasons

/**
 * Not Implemented
 *
 * The request method is not supported by the server and
 * cannot be handled.
 *
 */
export class NotImplemented extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 501,
      message: 'The request method is not supported by the server and cannot be handled.',
      title: 'Not Implemented',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501'
    }, ...options))
  }
}
CODE_CLASSES['501'] = NotImplemented

/**
 * Bad Gateway
 *
 * This error response means that the server, while
 * working as a gateway to get a response needed to handle
 * the request, got an invalid response.
 *
 */
export class BadGateway extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 502,
      message: 'This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.',
      title: 'Bad Gateway',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502'
    }, ...options))
  }
}
CODE_CLASSES['502'] = BadGateway

/**
 * Service Unavailable
 *
 * The server is not ready to handle the request.
 *
 */
export class ServiceUnavailable extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 503,
      message: 'The server is not ready to handle the request.',
      title: 'Service Unavailable',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503'
    }, ...options))
  }
}
CODE_CLASSES['503'] = ServiceUnavailable

/**
 * Gateway Time-out
 *
 * This error response is given when the server is acting
 * as a gateway and cannot get a response from the up-
 * stream server in time.
 *
 */
export class GatewayTimeout extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 504,
      message: 'This error response is given when the server is acting as a gateway and cannot get a response from the up-stream server in time.',
      title: 'Gateway Time-out',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504'
    }, ...options))
  }
}
CODE_CLASSES['504'] = GatewayTimeout

/**
 * HTTP Version Not Supported
 *
 * The HTTP version used in the request is not supported
 * by the server.
 *
 */
export class HTTPVersionNotSupported extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 505,
      message: 'The HTTP version used in the request is not supported by the server.',
      title: 'HTTP Version Not Supported',
      type: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505'
    }, ...options))
  }
}
CODE_CLASSES['505'] = HTTPVersionNotSupported

/**
 * Variant Also Negotiates
 *
 * The server has an internal configuration error: the
 * chosen variant resource is configured to engage in
 * transparent content negotiation itself, and is
 * therefore not a proper end point in the negotiation
 * process.
 *
 */
export class VariantAlsoNegotiates extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 506,
      message: 'The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.',
      title: 'Variant Also Negotiates',
      type: 'https://tools.ietf.org/html/rfc2295#section-8.1'
    }, ...options))
  }
}
CODE_CLASSES['506'] = VariantAlsoNegotiates

/**
 * Insufficient Storage
 *
 * Means the method could not be performed on the resource
 * because the server is unable to store the
 * representation needed to successfully complete the
 * request.
 *
 */
export class InsufficientStorage extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 507,
      message: 'Means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.',
      title: 'Insufficient Storage',
      type: 'https://tools.ietf.org/html/rfc2518#section-10.6'
    }, ...options))
  }
}
CODE_CLASSES['507'] = InsufficientStorage

/**
 * Network Authentication Required
 *
 * The client needs to authenticate to gain network
 * access.
 *
 */
export class NetworkAuthenticationRequired extends HttpError {
  constructor (...options) {
    super(parseErrorOptions({
      statusCode: 511,
      message: 'The client needs to authenticate to gain network access.',
      title: 'Network Authentication Required',
      type: 'https://tools.ietf.org/html/rfc6585#section-6'
    }, ...options))
  }
}
CODE_CLASSES['511'] = NetworkAuthenticationRequired

/**
 * Returns the value if it is a number between 100 and 699.
 * Otherwise returns undefined.
 * Supports strings containing numbers.
 *
 * @param {any} value
 * @returns {(number|undefined)}
 */
export const getStatusCode = (value) => {
  let returnValue
  if (typeof value === 'string' || typeof value === 'number') {
    const numValue = parseInt(`${value}`.split('.')[0], 10)
    if (numValue && numValue >= 100 && numValue <= 699) {
      returnValue = numValue
    }
  }
  return returnValue
}

/**
 * Returns true if obj is null or undefined
 *
 * @param obj
 */
const isNil = (obj) => {
  return obj === null || typeof obj === 'undefined'
}

/**
 * Returns true if obj is a string
 *
 * @param obj
 */
const isString = (obj) => {
  return typeof obj === 'string'
}

/**
 * Returns true if obj is a plain object, but is not null or undefined
 *
 * @param obj
 */
const isObj = (obj) => {
  return !isNil(obj) && Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * Returns true if obj is an Error instance
 *
 * @param obj
 */
const isErr = (obj) => {
  return obj instanceof Error
}

/**
 * Returns true if obj is a number, but not NaN
 *
 * @param obj
 */
const isNumber = (obj) => {
  return typeof obj === 'number' && !isNaN(obj)
}

/**
 * Returns true if obj has at least one of it's own keys
 *
 * @param {any} obj
 * @returns {boolean}
 */
const hasKeys = (obj) => {
  let keyCount = 0
  try {
    keyCount = Object.keys(obj).length
  } catch (_er) {
    console.log(_er)
  }
  return keyCount > 0
}
