# Map-Drawer-App
A small application that allows users to draw shapes in a map image. The idea is to simulate the highlighting of areas in the image.


## Focus points
- Organization
- Application architecture and design
- Data and control flow
- Ability to draw/edit/delete shapes
- Focus only on Front-end for now

## Steps
<table>
    <tr>
        <td>Step 1 - Organization</td>
        <td>
          <ul>
            <li>[x] Create Repository</li>
            <li>
              [x] Create Project Board in repository
              <ul>
                <li>[x] Create tickets with requirements </li>
              </ul>
            </li>            
            <li>
              [x] Create README file
              <ul>
                <li>[x] Create list of objectives</li>
                <li>[x] Create space for decisions making</li>
                <li>[x] Create space for future enhancements and ideas</li>
              </ul>
            </li>           
          </ul>
        </td>
    </tr>
   <tr>
        <td>Step 2 - Base Project Setup</td>
        <td>
          <ul>
            <li>[x] Docker</li>
            <li>[x] Dev Container</li>
            <li>[x] Vite</li>
            <li>[x] React</li>
            <li>[x] Vitest / testing-library</li>
          </ul>
        </td>
    </tr>
   <tr>
        <td>Step 3 - Implementation</td>
        <td>
          <ul>
            <li>[ ] Determine object models (Mock Data)</li>
            <li>[ ] Unit Tests (Image service)</li>
            <li>[ ] Unit Tests (Shapes service)</li>
            <li>[ ] CI/CD for tests</li>
            <li>[ ] Retreive Images (Images service)</li>
            <li>[ ] Retreive and Send Shapes data (Shapes service)</li>
            <li>[ ] Ability to draw shapes</li>
          </ul>
        </td>
    </tr>
<table>


## Decisions Made
- GitHub Project Board
  - For proper organization and feature documentation
  - Keep track of progress and for possible future enchancements  
- Docker
  - Faster project setup (I.e Onboarding)
  - To ensure consistent functioning across different machines
  - Stable development environment
 
## Ideas for future enhancements
- Convert to a full-stack MERN application that communicates with a Back-end Server and Database
- Implement CI/CD pipelines for deployments
- Deploy project to GitHub pages

<br>
<hr>
<br>

## Project Setup

### Docker Desktop
```
In order to avoid issues with versioning, it's best to run this application with Docker to set up the enviornment.
```

### Install dependencies
```
npm run i 
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Run tests
```
npm run test
```

### Run test coverage
```
npm run test:cov
```

### Lint files
```
npm run lint
```
