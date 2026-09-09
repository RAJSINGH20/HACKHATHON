import crypto from 'crypto';

// Lightweight authentication module. Store users in a database in production.
const users = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const TOKEN_TTL = 60 * 60 * 24;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
	return new Promise((resolve, reject) => {
		crypto.scrypt(password, salt, 64, (error, derivedKey) => {
			if (error) return reject(error);
			resolve(`${salt}:${derivedKey.toString('hex')}`);
		});
	});
}

async function verifyPassword(password, storedHash) {
	const [salt, key] = storedHash.split(':');
	const candidate = await hashPassword(password, salt);
	return crypto.timingSafeEqual(
		Buffer.from(candidate.split(':')[1], 'hex'),
		Buffer.from(key, 'hex')
	);
}

function encode(value) {
	return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function createToken(user) {
	const header = encode({ alg: 'HS256', typ: 'JWT' });
	const payload = encode({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL });
	const data = `${header}.${payload}`;
	const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
	return `${data}.${signature}`;
}

function verifyToken(token) {
	const [header, payload, signature] = token.split('.');
	if (!header || !payload || !signature) throw new Error('Invalid token');
	const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
	if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
		throw new Error('Invalid token');
	}
	const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
	if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
	return data;
}

async function register(email, password) {
	email = String(email || '').trim().toLowerCase();
	if (!/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8) {
		throw new Error('A valid email and password of at least 8 characters are required');
	}
	if (users.has(email)) throw new Error('User already exists');
	const user = { id: crypto.randomUUID(), email, passwordHash: await hashPassword(password) };
	users.set(email, user);
	return { id: user.id, email: user.email, token: createToken(user) };
}

async function login(email, password) {
	const user = users.get(String(email || '').trim().toLowerCase());
	if (!user || !(await verifyPassword(String(password || ''), user.passwordHash))) {
		throw new Error('Invalid email or password');
	}
	return { id: user.id, email: user.email, token: createToken(user) };
}

function authenticate(token) {
	return verifyToken(String(token || '').replace(/^Bearer\s+/i, ''));
}

module.exports = { register, login, authenticate };
