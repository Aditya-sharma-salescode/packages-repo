export async function validateWithOtp(
  cb: (verifiedUser?: any, response?: any) => void | Promise<void>,
  _otp?: unknown,
  _user?: unknown,
  _url?: string,
  _payload?: unknown,
  _method?: string
) {
  await cb(undefined, { success: true });
}

