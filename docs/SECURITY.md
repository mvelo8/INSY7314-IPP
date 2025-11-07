# Security: handling secrets and certificates

This project contains local development credentials (.env files) and self-signed certificates. Do not commit real secrets or certificates to source control. Follow these steps to hide and remediate if secrets were accidentally committed.

1) Ignore future commits

  - A top-level `.gitignore` has been added to ignore `.env` files and the `certs/` folder. Ensure your editor/git is using it.

2) If secrets/certs were already committed (do this only if needed)

  # Remove the files from the git index but keep them locally
  git rm --cached backend/.env frontend/.env certs/localhost.pem certs/localhost-key.pem frontend/localhost.pem frontend/localhost-key.pem
  git commit -m "chore: remove secrets and certs from repository"

  # NOTE: Removing from the index does not remove them from history. If you need to fully purge them, use the BFG or git filter-repo tools (be careful; this rewrites history).

3) Rotate any secrets that were exposed

  - If any real credentials were committed (DB credentials, API keys), rotate them immediately.

4) Use example env files

  - Use `backend/.env.example` and `frontend/.env.example` (added) as templates. Copy to `backend/.env` and `frontend/.env` locally and fill secrets.

5) Recommended practices

  - Use a secrets manager (HashiCorp Vault, AWS Secrets Manager) for production secrets.
  - Add a pre-commit hook (e.g., `git-secrets`) to prevent accidental commits of secrets.
  - Generate local dev certificates with `mkcert` or your local CA and do not commit them to the repo.
