# BeHere
This project is dedicated to the late **Erik Rushford**, the originator of this idea. Rest in peace.

BeHere is an application that encourages connectivity in real-world locations through in-person events. The main user-interface is an interactive map on which upcoming events are overlayed. Users or groups can post time-sensitive events to a map, which other users can discover and attend. Furthermore, joining the map enables a group-specific chat in which attendees can talk before, during, or after events.

## Members
Nicholas Amigo

Aidan Persaud

John Glass

CEN3031 - Group 63

## Use
### Prerequisites
- Install [Node.js](https://nodejs.org/en/download/), [Angular](https://angular.io/guide/setup-local), and [Go](https://go.dev/doc/install)
- Install gin utility: `go install github.com/codegangsta/gin@latest`
- To run the go-sqlite server on Windows, you may need the mingw64bit version [download here](https://sourceforge.net/projects/mingw-w64/)

### Installation and Running
1. Clone repository in your GOPATH directory. (Usually $Home/Go/src or C:\Users\yourname\go\src. Often, **you will have to make the "src" folder yourself**.)
2. Navigate with terminal to `/behere_project` run `npm install` to update the npm packages.
3. `./serve.sh` to launch both the Go server and Angular.

### Configuring Google OAuth
AJ Persaud has this configured on [Google Console](https://console.cloud.google.com/apis/credentials?project=smart-theory-377014)