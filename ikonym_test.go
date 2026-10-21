package ikonym

import (
	"strings"
	"testing"
)

func TestBundledStylesParse(t *testing.T) {
	for _, density := range Densities {
		if _, err := StyleJSON(density); err != nil {
			t.Errorf("StyleJSON(%d): %v", density, err)
		}
		if _, err := CreateAvatar("ikonym-test", density, 128, 0, ""); err != nil {
			t.Errorf("CreateAvatar density %d: %v", density, err)
		}
	}
}

func TestUnsupportedDensity(t *testing.T) {
	if _, err := StyleJSON(4); err == nil {
		t.Fatal("StyleJSON(4) unexpectedly succeeded")
	}
	if _, err := CreateAvatar("ikonym-test", 4, 128, 0, ""); err == nil {
		t.Fatal("CreateAvatar with density 4 unexpectedly succeeded")
	}
}

func TestAvatarOutputAndDeterminism(t *testing.T) {
	first, err := CreateAvatar("same-seed", 7, 128, 0, "")
	if err != nil {
		t.Fatal(err)
	}
	second, err := CreateAvatar("same-seed", 7, 128, 0, "")
	if err != nil {
		t.Fatal(err)
	}
	if first != second || !strings.HasPrefix(first, "<svg") {
		t.Fatal("avatar output is not a deterministic SVG")
	}
}

func TestAvatarDataURIAndTitle(t *testing.T) {
	uri, err := CreateAvatarDataURI("ikonym-test", 5, 128, 0, "Test avatar")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.HasPrefix(uri, "data:image/svg+xml;charset=utf-8,") {
		t.Fatalf("unexpected data URI: %s", uri[:min(len(uri), 48)])
	}
	svg, err := CreateAvatar("ikonym-test", 5, 128, 0, "Test avatar")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(svg, "Test avatar") {
		t.Fatal("SVG does not contain the requested title")
	}
}
