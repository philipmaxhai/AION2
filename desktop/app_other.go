//go:build !windows

package main

import (
	"fmt"
	"os"
)

// Die Desktop-App ist nur für Windows gebaut; auf anderen Systemen reicht die Seite im Browser.
func main() {
	fmt.Fprintf(os.Stderr, "Daeva-Kompass Desktop läuft nur unter Windows. Öffne %s im Browser.\n", liveURL)
	os.Exit(1)
}
