//! Deterministic geometric SVG avatars generated from stable identifiers.

use dicebear_core::{Avatar, Style};
use serde_json::{json, Value};
use std::error::Error;
use std::fmt;

/// Supported Ikonym grid densities.
pub const DENSITIES: [u8; 5] = [3, 5, 7, 9, 12];

/// Error returned when a grid density is not supported.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UnsupportedDensity(pub u8);

impl fmt::Display for UnsupportedDensity {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            formatter,
            "Ikonym density must be 3, 5, 7, 9, or 12; got {}",
            self.0
        )
    }
}

impl Error for UnsupportedDensity {}

/// Return the bundled portable DiceBear JSON definition for a density.
pub fn style_json(density: u8) -> Result<&'static str, UnsupportedDensity> {
    match density {
        3 => Ok(include_str!("../../styles/ikonym-3.json")),
        5 => Ok(include_str!("../../styles/ikonym-5.json")),
        7 => Ok(include_str!("../../styles/ikonym-7.json")),
        9 => Ok(include_str!("../../styles/ikonym-9.json")),
        12 => Ok(include_str!("../../styles/ikonym-12.json")),
        _ => Err(UnsupportedDensity(density)),
    }
}

fn render_avatar(
    identifier: &str,
    density: u8,
    size: u32,
    border_radius: u8,
    title: Option<&str>,
) -> Result<Avatar, Box<dyn Error>> {
    let definition = style_json(density)?;
    let style = Style::from_str(definition)?;
    let mut options = json!({
        "seed": identifier,
        "size": size.clamp(24, 1024),
        "borderRadius": border_radius.min(50),
    });
    if let Some(title) = title {
        options["title"] = Value::String(title.to_owned());
    }

    Ok(Avatar::new(&style, options)?)
}

/// Generate an SVG avatar from a username, account ID, or other stable identifier.
pub fn create_avatar(
    identifier: &str,
    density: u8,
    size: u32,
    border_radius: u8,
    title: Option<&str>,
) -> Result<String, Box<dyn Error>> {
    Ok(
        render_avatar(identifier, density, size, border_radius, title)?
            .to_svg()
            .to_owned(),
    )
}

/// Generate a data URI suitable for an HTML image source.
pub fn create_avatar_data_uri(
    identifier: &str,
    density: u8,
    size: u32,
    border_radius: u8,
    title: Option<&str>,
) -> Result<String, Box<dyn Error>> {
    Ok(render_avatar(identifier, density, size, border_radius, title)?.to_data_uri())
}

/// Parse a density's bundled JSON definition into a serde value.
pub fn style_definition(density: u8) -> Result<Value, Box<dyn Error>> {
    Ok(serde_json::from_str(style_json(density)?)?)
}

#[cfg(test)]
mod tests {
    use super::{create_avatar, create_avatar_data_uri, style_definition, style_json, DENSITIES};

    #[test]
    fn all_style_files_parse_for_every_density() {
        for density in DENSITIES {
            let definition = style_definition(density).expect("bundled style parses");
            assert_eq!(definition["canvas"]["width"], 100);
            assert_eq!(definition["canvas"]["height"], 100);
        }
    }

    #[test]
    fn rejects_unsupported_density() {
        assert!(style_json(4).is_err());
    }

    #[test]
    fn svg_and_data_uri_are_generated() {
        let svg = create_avatar("ikon-rust-test", 7, 128, 0, None).expect("SVG renders");
        let data_uri =
            create_avatar_data_uri("ikon-rust-test", 7, 128, 0, None).expect("data URI renders");
        assert!(svg.starts_with("<svg"));
        assert!(data_uri.starts_with("data:image/svg+xml"));
    }

    #[test]
    fn output_is_deterministic() {
        let first = create_avatar("ikon-repeat", 5, 128, 0, None).expect("SVG renders");
        let second = create_avatar("ikon-repeat", 5, 128, 0, None).expect("SVG renders");
        assert_eq!(first, second);
    }
}
