export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  walletAddress: /^0x[a-fA-F0-9]{40}$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  ipv6: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}(:\d{2})?$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z]+$/,
  numeric: /^\d+$/,
  decimal: /^\d+\.\d+$/,
  integer: /^-?\d+$/,
  positiveInteger: /^\d+$/,
  negativeInteger: /^-\d+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  base64: /^[A-Za-z0-9+/]*={0,2}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
};

export const testPattern = (value: string, pattern: RegExp | string): boolean => {
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
  return regex.test(value);
};

export const matchPattern = (
  value: string,
  pattern: RegExp | string
): RegExpMatchArray | null => {
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
  return value.match(regex);
};

export const extractMatches = (
  text: string,
  pattern: RegExp | string
): string[] => {
  const regex = typeof pattern === "string" ? new RegExp(pattern, "g") : new RegExp(pattern.source, "g");
  const matches = text.match(regex);
  return matches || [];
};

export const replacePattern = (
  text: string,
  pattern: RegExp | string,
  replacement: string | ((match: string, ...args: unknown[]) => string)
): string => {
  const regex = typeof pattern === "string" ? new RegExp(pattern, "g") : new RegExp(pattern.source, "g");
  if (typeof replacement === "function") {
    return text.replace(regex, replacement as (match: string, ...args: unknown[]) => string);
  }
  return text.replace(regex, replacement);
};

export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const createRegex = (
  pattern: string,
  flags: string = ""
): RegExp => {
  return new RegExp(pattern, flags);
};

export const validateEmail = (email: string): boolean => {
  return patterns.email.test(email);
};

export const validateUrl = (url: string): boolean => {
  return patterns.url.test(url);
};

export const validatePhone = (phone: string): boolean => {
  return patterns.phone.test(phone);
};

export const validateWalletAddress = (address: string): boolean => {
  return patterns.walletAddress.test(address);
};

export const validateHexColor = (color: string): boolean => {
  return patterns.hexColor.test(color);
};

export const validateSlug = (slug: string): boolean => {
  return patterns.slug.test(slug);
};

export const validateUuid = (uuid: string): boolean => {
  return patterns.uuid.test(uuid);
};

export const validateIpv4 = (ip: string): boolean => {
  return patterns.ipv4.test(ip);
};

export const validateIpv6 = (ip: string): boolean => {
  return patterns.ipv6.test(ip);
};

export const validateCreditCard = (card: string): boolean => {
  return patterns.creditCard.test(card.replace(/\s/g, ""));
};

export const validatePassword = (password: string): boolean => {
  return patterns.password.test(password);
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "");
};

export const extractEmails = (text: string): string[] => {
  return extractMatches(text, patterns.email);
};

export const extractUrls = (text: string): string[] => {
  return extractMatches(text, patterns.url);
};

export const extractPhoneNumbers = (text: string): string[] => {
  return extractMatches(text, patterns.phone);
};

export const extractWalletAddresses = (text: string): string[] => {
  return extractMatches(text, patterns.walletAddress);
};

export const extractHashtags = (text: string): string[] => {
  return extractMatches(text, /#[\w]+/g);
};

export const extractMentions = (text: string): string[] => {
  return extractMatches(text, /@[\w]+/g);
};

export const maskSensitiveData = (
  text: string,
  pattern: RegExp | string,
  maskChar: string = "*"
): string => {
  const regex = typeof pattern === "string" ? new RegExp(pattern, "g") : new RegExp(pattern.source, "g");
  return text.replace(regex, (match) => maskChar.repeat(match.length));
};

export const highlightMatches = (
  text: string,
  pattern: RegExp | string,
  className: string = "highlight"
): string => {
  const regex = typeof pattern === "string" ? new RegExp(pattern, "gi") : new RegExp(pattern.source, "gi");
  return text.replace(regex, (match) => `<span class="${className}">${match}</span>`);
};

export const countMatches = (text: string, pattern: RegExp | string): number => {
  const regex = typeof pattern === "string" ? new RegExp(pattern, "g") : new RegExp(pattern.source, "g");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
};

export const splitByPattern = (
  text: string,
  pattern: RegExp | string
): string[] => {
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
  return text.split(regex).filter((part) => part.length > 0);
};

