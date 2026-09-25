export const leafImages = {
  heroBotanical:
    "https://images.unsplash.com/photo-1580133318324-f2f76d987dd8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JlZW4lMjBsZWFmJTIwY2xvc2UlMjB1cHxlbnwwfHx8fDE3OTAzNzg4NTF8MA&ixlib=rb-4.1.0&q=85",
  macroTexture:
    "https://images.unsplash.com/photo-1574002332972-fd2e0f7f1ea9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHxoZWFsdGh5JTIwZ3JlZW4lMjBsZWFmJTIwY2xvc2UlMjB1cHxlbnwwfHx8fDE3OTAzNzg4NTF8MA&ixlib=rb-4.1.0&q=85",
  spot: "https://images.unsplash.com/photo-1692481060581-98c224124f12?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGxlYWYlMjBkaXNlYXNlJTIwYWdyaWN1bHR1cmV8ZW58MHx8fHwxNzkwMzc4ODUxfDA&ixlib=rb-4.1.0&q=85",
  blight:
    "https://images.unsplash.com/photo-1604481986614-e48521951d81?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxwbGFudCUyMGxlYWYlMjBkaXNlYXNlJTIwYWdyaWN1bHR1cmV8ZW58MHx8fHwxNzkwMzc4ODUxfDA&ixlib=rb-4.1.0&q=85",
  healthy:
    "https://images.unsplash.com/photo-1566249099725-1b0ce8da8c32?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwzfHxoZWFsdGh5JTIwZ3JlZW4lMjBsZWFmJTIwY2xvc2UlMjB1cHxlbnwwfHx8fDE3OTAzNzg4NTF8MA&ixlib=rb-4.1.0&q=85",
  field:
    "https://images.unsplash.com/photo-1696371269777-88d1ce71642c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBpbnNwZWN0aW5nJTIwY3JvcHMlMjBmaWVsZHxlbnwwfHx8fDE3OTAzNzg4NTF8MA&ixlib=rb-4.1.0&q=85",
} as const;

export const sampleLeaves = [
  { id: "healthy-tomato", label: "Healthy Tomato", hint: "Baseline healthy leaf", url: leafImages.healthy },
  { id: "early-blight-potato", label: "Early Blight Potato", hint: "Necrotic margins", url: leafImages.blight },
  { id: "leaf-spot-pepper", label: "Leaf Spot Bell Pepper", hint: "Chlorotic rings", url: leafImages.spot },
  { id: "rust-apple", label: "Rust Apple", hint: "Macro vein detail", url: leafImages.macroTexture },
] as const;

export const supportedCrops = [
  { crop: "Tomato", diseases: ["Early blight", "Late blight", "Leaf spot", "Mosaic virus"] },
  { crop: "Potato", diseases: ["Early blight", "Late blight", "Black scurf"] },
  { crop: "Bell Pepper", diseases: ["Bacterial spot", "Cercospora leaf spot"] },
  { crop: "Apple", diseases: ["Cedar apple rust", "Scab", "Black rot"] },
  { crop: "Grape", diseases: ["Black rot", "Esca", "Leaf blight"] },
  { crop: "Corn", diseases: ["Common rust", "Gray leaf spot", "Northern leaf blight"] },
];
