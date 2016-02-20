# Trellify QvNotebook

**NodeJS script to convert [Quiver](http://happenapps.com/#quiver) notebook to [Trello](https://trello.com) list**

## TODO

- [ ] Order of notes in notebooks not accounted for. Need to look at meta created_at and then set a position before creating cards
- [ ] Only markdown cells are taken, do something about this, possibly just error
- [ ] If board doesn't exist, have option to create board
- [ ] Handle errors properly
- [ ] Update option, if a list with the same name exists
  - [ ] Change existing cards with same note name by overwriting description
  - [ ] Add new cards for new notes 

## Usage

Download the source

Run npm install

node index.js PATH_TO_.qvnotebook_FILE BOARD_NAME