import { OAuthProvider } from '@repo/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { z } from 'zod';

interface OAuthClientOptions<T> {
  provider: OAuthProvider;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  urls: {
    auth: string;
    token: string;
    user: string;
  };
  userInfo: {
    schema: z.ZodSchema<T>;
    parser: (data: T) => {
      id: string;
      email: string;
      firstName: string;
      middleName: string;
      lastName?: string;
    };
  };
}

export class OAuthClient<T> {
  private readonly provider: OAuthProvider;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly scopes: string[];

  private readonly urls: {
    auth: string;
    token: string;
    user: string;
  };

  private readonly userInfo: {
    schema: z.ZodSchema<T>;
    parser: (data: T) => {
      id: string;
      email: string;
      firstName: string;
      middleName: string;
      lastName?: string;
    };
  };

  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
    id_token: z.string(),
    expires_in: z.number(),
  });

  constructor(
    private readonly configService: ConfigService,
    args: OAuthClientOptions<T>,
  ) {
    const { provider, clientId, clientSecret, scopes, urls, userInfo } = args;
    this.provider = provider;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
    this.urls = urls;
    this.userInfo = userInfo;
  }

  private get redirectUrl() {
    return `${this.configService.get<string>('OAUTH_REDIRECT_URL_BASE')}/${this.provider}`;
  }

  private async fetchToken(code: string, codeVerifier: string) {
    const res = await fetch(this.urls.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUrl,
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code_verifier: codeVerifier,
      }),
    });

    const rawData = await res.json();
    const parsed = this.tokenSchema.safeParse(rawData);
    if (!parsed.success) {
      throw new InvalidTokenException(parsed.error);
    }
    return {
      accessToken: parsed.data.access_token,
      tokenType: parsed.data.token_type,
      idToken: parsed.data.id_token,
      expiresIn: parsed.data.expires_in,
    };
  }

  createAuthUrl() {
    const url = new URL(this.urls.auth);
    const cookieState = this.createState();
    const codeVerifier = this.createCodeVerifier();
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectUrl.toString());
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', this.scopes.join(' '));
    url.searchParams.set('state', cookieState);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set(
      'code_challenge',
      crypto.hash('sha256', codeVerifier, 'base64url'),
    );
    return { url: url.toString(), cookieState, codeVerifier };
  }

  async fetchUser(code: string, codeVerifier: string) {
    const {
      accessToken,
      tokenType,
      idToken,
      expiresIn
    } = await this.fetchToken(code, codeVerifier);
    const res = await fetch(this.urls.user, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    const rawData = await res.json();
    const parsed = this.userInfo.schema.safeParse(rawData);
    if (!parsed.success) {
      throw new InvalidUserException(parsed.error);
    }
    return {
      user: this.userInfo.parser(parsed.data),
      accessToken,
      idToken,
      expiresIn,
      tokenType
    };
  }

  createState() {
    const state = crypto.randomBytes(64).toString('hex').normalize();
    return state;
  }

  createCodeVerifier() {
    const codeVerifier = crypto.randomBytes(64).toString('hex').normalize();
    return codeVerifier;
  }
}

class InvalidTokenException extends HttpException {
  constructor(zodError: z.ZodError<any>) {
    super(
      {
        message: 'Invalid Token',
        details: zodError.issues,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

class InvalidUserException extends HttpException {
  constructor(zodError: z.ZodError) {
    super(
      {
        message: 'Invalid User',
        details: zodError.issues,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
