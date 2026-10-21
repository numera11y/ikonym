using System.Reflection;

namespace Ikonym;

/// <summary>Access to the portable, bundled Ikonym style definitions.</summary>
public static class StyleDefinition
{
    /// <summary>The supported mosaic grid densities.</summary>
    public static IReadOnlyList<int> Densities { get; } = Array.AsReadOnly([3, 5, 7, 9, 12]);

    /// <summary>Read the bundled DiceBear JSON definition for a density.</summary>
    public static string GetJson(int density)
    {
        if (!Densities.Contains(density))
        {
            throw new ArgumentOutOfRangeException(
                nameof(density), density, "Ikonym density must be 3, 5, 7, 9, or 12.");
        }

        var resourceName = $"Ikonym.Styles.ikonym-{density}.json";
        using var stream = typeof(StyleDefinition).Assembly.GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException($"Bundled style resource '{resourceName}' was not found.");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}
