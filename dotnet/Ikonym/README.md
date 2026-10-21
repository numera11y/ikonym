# Ikonym for .NET

Deterministic geometric SVG avatars generated from a stable identifier. Ikonym bundles all five style definitions and renders them with DiceBear Core.

```sh
dotnet add package Ikonym
```

```csharp
using Ikonym;

var svg = AvatarGenerator.CreateAvatar(
    "account-4821",
    density: 7,
    size: 128,
    title: "Account avatar");

Console.WriteLine(svg);
```

Use `AvatarGenerator.CreateAvatarDataUri` for an SVG data URI or `StyleDefinition.GetJson(density)` to access the portable DiceBear definition. Supported densities are 3, 5, 7, 9, and 12.
