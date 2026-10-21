// Package ikonym generates deterministic geometric SVG avatars.
package ikonym

import (
	"embed"
	"fmt"

	dicebear "github.com/dicebear/dicebear-go/v10"
)

// Densities lists the supported mosaic grid sizes.
var Densities = [...]int{3, 5, 7, 9, 12}

//go:embed styles/ikonym-*.json
var styleFiles embed.FS

// StyleJSON returns the bundled DiceBear style definition for a density.
func StyleJSON(density int) ([]byte, error) {
	if !supportedDensity(density) {
		return nil, fmt.Errorf("ikonym: unsupported density %d; want 3, 5, 7, 9, or 12", density)
	}
	return styleFiles.ReadFile(fmt.Sprintf("styles/ikonym-%d.json", density))
}

// CreateAvatar returns an SVG avatar for an identifier and mosaic density.
// Size is clamped to 24–1024 pixels and borderRadius to 0–50 percent.
// An empty title omits the SVG title element.
func CreateAvatar(identifier string, density, size, borderRadius int, title string) (string, error) {
	avatar, err := renderAvatar(identifier, density, size, borderRadius, title)
	if err != nil {
		return "", err
	}
	return avatar.SVG(), nil
}

// CreateAvatarDataURI returns an SVG data URI for an identifier and density.
func CreateAvatarDataURI(identifier string, density, size, borderRadius int, title string) (string, error) {
	avatar, err := renderAvatar(identifier, density, size, borderRadius, title)
	if err != nil {
		return "", err
	}
	return avatar.DataURI(), nil
}

func renderAvatar(identifier string, density, size, borderRadius int, title string) (*dicebear.Avatar, error) {
	definition, err := StyleJSON(density)
	if err != nil {
		return nil, err
	}
	style, err := dicebear.NewStyle(definition)
	if err != nil {
		return nil, err
	}
	if size < 24 {
		size = 24
	} else if size > 1024 {
		size = 1024
	}
	if borderRadius < 0 {
		borderRadius = 0
	} else if borderRadius > 50 {
		borderRadius = 50
	}
	options := map[string]any{
		"seed":         identifier,
		"size":         size,
		"borderRadius": borderRadius,
	}
	if title != "" {
		options["title"] = title
	}
	return dicebear.NewAvatar(style, options)
}

func supportedDensity(density int) bool {
	for _, supported := range Densities {
		if density == supported {
			return true
		}
	}
	return false
}
