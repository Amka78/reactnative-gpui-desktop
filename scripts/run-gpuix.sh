#!/usr/bin/env bash
# @gpuix/native の Linux バイナリは GLIBC 2.38+ を要求する。
# GLIBC が古い環境では、システムを変更せずに Ubuntu 24.04 の glibc を
# キャッシュへ展開し、そのローダー経由で bun を起動する。
set -euo pipefail

GLIBC_MIN="2.38"
GLIBC_DEB="libc6_2.39-0ubuntu8.9_amd64.deb"
GLIBC_URL="http://archive.ubuntu.com/ubuntu/pool/main/g/glibc/${GLIBC_DEB}"
CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/gpuix-glibc-2.39"
LOADER="${CACHE_DIR}/usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2"

BUN_BIN="${BUN_BIN:-$(command -v bun || true)}"
if [[ -z "${BUN_BIN}" ]]; then
  echo "bun が見つかりません。https://bun.sh からインストールしてください。" >&2
  exit 1
fi

libc_version="$(getconf GNU_LIBC_VERSION 2>/dev/null | awk '{print $2}' || true)"

# Linux 以外、または GLIBC が十分新しければそのまま実行する。
if [[ -z "${libc_version}" ]] || printf '%s\n%s\n' "${GLIBC_MIN}" "${libc_version}" | sort -V -C; then
  exec "${BUN_BIN}" "$@"
fi

if [[ "$(uname -m)" != "x86_64" ]]; then
  echo "GLIBC ${libc_version} では @gpuix/native を読み込めません。" >&2
  echo "x86_64 以外の環境では Ubuntu 24.04+ など GLIBC ${GLIBC_MIN}+ が必要です。" >&2
  exit 1
fi

if [[ ! -x "${LOADER}" ]]; then
  echo "GLIBC ${GLIBC_MIN}+ を ${CACHE_DIR} に展開します..." >&2
  mkdir -p "${CACHE_DIR}"
  tmp_dir="$(mktemp -d)"
  trap 'rm -rf "${tmp_dir}"' EXIT
  curl -fsSL "${GLIBC_URL}" -o "${tmp_dir}/libc6.deb"
  dpkg-deb -x "${tmp_dir}/libc6.deb" "${CACHE_DIR}"
fi

exec "${LOADER}" \
  --library-path "${CACHE_DIR}/usr/lib/x86_64-linux-gnu:/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu" \
  "${BUN_BIN}" "$@"
