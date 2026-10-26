#!/usr/bin/env bash
# Baut die Desktop-App für Windows (64 Bit) und legt sie mit Prüfsumme nach public/download/.
# Läuft auch unter Linux und macOS (reines Go, kein cgo). Braucht Go ab 1.22.
#
#   tools/build-desktop.sh            # Version = heutiges Datum, z. B. 2026.10.26
#   tools/build-desktop.sh 2026.10.27
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="${1:-$(date +%Y.%m.%d)}"
OUT="$ROOT/public/download"
cd "$ROOT/desktop"

go test ./...
GOOS=windows GOARCH=amd64 go vet ./...

# Symbol, Versionsangaben und Manifest (DPI-Bewusstsein) als Windows-Ressource
go run github.com/tc-hib/go-winres@v0.3.3 make --arch amd64 \
  --product-version "$VERSION" --file-version "$VERSION"

mkdir -p "$OUT"
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -buildvcs=false \
  -ldflags "-H windowsgui -w -X main.version=$VERSION" -o "$OUT/DaevaKompass.exe" .

BYTES=$(wc -c < "$OUT/DaevaKompass.exe" | tr -d ' ')
SHA=$( (sha256sum "$OUT/DaevaKompass.exe" 2>/dev/null || shasum -a 256 "$OUT/DaevaKompass.exe") | cut -d' ' -f1)
DATUM=$(date +%d.%m.%Y)
printf '{"datei":"DaevaKompass.exe","version":"%s","datum":"%s","bytes":%s,"sha256":"%s"}\n' \
  "$VERSION" "$DATUM" "$BYTES" "$SHA" > "$OUT/DaevaKompass.json"
echo "gebaut: public/download/DaevaKompass.exe ($BYTES Bytes, SHA-256 $SHA)"
