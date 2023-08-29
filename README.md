# Youtube uploader

## Table of Contents

- [Installation](#installation)
- [Tech Stack](#tech-stack)

## Installation

1. Clone this repo
  ```
 git clone https://github.com/DkDeepak001/youtube-uploader
```

2. Create a .env file and the below values
 ```
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="" 
DATABASE_URL="" //monogdb url
```
3. Google project setup
```
Create a project from https://console.cloud.google.com/
1. goto Enable API & services from the left sidebar
2. Search for YouTube data API v3 and enable it.
3. Create an oAuth consent screen and select all the scopes 
4. Create OAuth 2.0 Client IDs from Credentials 
```

5. Install Dependencies 
```
npm install
```
6. Run
```
npm run dev
```

## Tech stack

1. Nextjs (https://nextjs.org/docs)
2. Prisma (https://www.prisma.io/docs)
3. tRPC (https://trpc.io/docs)
4. NextAuth (https://next-auth.js.org/getting-started/introduction)


## Contributing
Contributions are welcome! To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request in the original repository.
