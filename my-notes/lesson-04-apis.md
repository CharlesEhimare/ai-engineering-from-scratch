# Lesson 4: APIs & Keys

Secure key setup:
- Key stored in .env (not export, which would save it in ~/.bash_history)
- .env confirmed ignored: git check-ignore -v .env
- chmod 600 .env so only my user can read it
- Load with: set -a; source .env; set +a
- Only ever print the first characters: echo ${ANTHROPIC_API_KEY:0:10}

Exercise 3 (fake key): 401 authentication_error, "invalid x-api-key".
Raw HTTP returns the same 401 JSON; the SDK wraps it as AuthenticationError.
No key at all: the SDK fails before sending anything (client-side error).
Real API calls deferred to Phase 11 (paid). Hugging Face is free for Phases 4-10.
