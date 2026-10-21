using System.Text.Json.Nodes;
using Ikonym;
using Xunit;

namespace Ikonym.Tests;

public class AvatarGeneratorTests
{
    [Fact]
    public void BundledDefinitionsRenderForEveryDensity()
    {
        foreach (var density in StyleDefinition.Densities)
        {
            var definition = JsonNode.Parse(StyleDefinition.GetJson(density));
            Assert.Equal(100, definition?["canvas"]?["width"]?.GetValue<int>());
            Assert.StartsWith("<svg", AvatarGenerator.CreateAvatar("ikonym-test", density));
        }
    }

    [Fact]
    public void RejectsUnsupportedDensity()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => StyleDefinition.GetJson(4));
        Assert.Throws<ArgumentOutOfRangeException>(() => AvatarGenerator.CreateAvatar("ikonym-test", 4));
    }

    [Fact]
    public void OutputIsDeterministic()
    {
        var first = AvatarGenerator.CreateAvatar("same-seed", 7);
        var second = AvatarGenerator.CreateAvatar("same-seed", 7);

        Assert.Equal(first, second);
    }

    [Fact]
    public void GeneratesDataUriAndAccessibleTitle()
    {
        var svg = AvatarGenerator.CreateAvatar("ikonym-test", title: "Test avatar");
        var dataUri = AvatarGenerator.CreateAvatarDataUri("ikonym-test");

        Assert.Contains("<title>Test avatar</title>", svg);
        Assert.StartsWith("data:image/svg+xml;charset=utf-8,", dataUri);
    }
}
