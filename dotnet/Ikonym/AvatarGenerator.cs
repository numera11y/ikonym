using System.Text.Json.Nodes;
using DiceBear;

namespace Ikonym;

/// <summary>Generates deterministic SVG avatars with the Ikonym style.</summary>
public static class AvatarGenerator
{
    /// <summary>Create an SVG avatar from a stable identifier and a mosaic density.</summary>
    /// <param name="identifier">A username, account ID, or other stable identifier.</param>
    /// <param name="density">The grid density: 3, 5, 7, 9, or 12.</param>
    /// <param name="size">The SVG size in pixels, clamped to 24–1024.</param>
    /// <param name="borderRadius">The corner radius in percent, clamped to 0–50.</param>
    /// <param name="title">An optional accessible SVG title.</param>
    public static string CreateAvatar(
        string identifier,
        int density = 7,
        int size = 160,
        int borderRadius = 0,
        string? title = null)
    {
        return CreateDiceBearAvatar(identifier, density, size, borderRadius, title).ToSvg();
    }

    /// <summary>Create an SVG data URI from a stable identifier and a mosaic density.</summary>
    public static string CreateAvatarDataUri(
        string identifier,
        int density = 7,
        int size = 160,
        int borderRadius = 0,
        string? title = null)
    {
        return CreateDiceBearAvatar(identifier, density, size, borderRadius, title).ToDataUri();
    }

    private static Avatar CreateDiceBearAvatar(
        string identifier,
        int density,
        int size,
        int borderRadius,
        string? title)
    {
        var style = Style.Parse(StyleDefinition.GetJson(density));
        var options = new JsonObject
        {
            ["seed"] = identifier,
            ["size"] = Math.Clamp(size, 24, 1024),
            ["borderRadius"] = Math.Clamp(borderRadius, 0, 50),
        };
        if (title is not null)
        {
            options["title"] = title;
        }

        return new Avatar(style, options);
    }
}
