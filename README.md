# MediaReplacement

Proof of Concept of a replacement for the media section and picker in Umbraco

Originated from a (talk for CodeGarden)[https://slides.com/stevetemple/making-the-dream-a-reality]

# Developing

In the src/MediaReplacement.Module folder

Run: `npm install`
Then: `npm run watch`

Any changes will be automatically copied to the test site

# To test

In the src/MediaReplacement.TestSite folder

Run: `dotnet run`
Browse to `https://localhost:44311/umbraco`
Login as `test@test.com` Password `testtesttest`

On the test content use the media picker to see the replacement version