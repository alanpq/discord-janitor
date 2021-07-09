# discord-janitor

A Discord bot that allows you to delete messages that match custom filters.

## Commands

### .add `type` `author` `...` `timeout`

Adds a new filter.

- `type` - type of filter (`simple`, `match`)
- `author` - id of message author to filter for
- `...` - type specific arguments
  - type `simple`:
    - none
  - type `match`:
    - `match` - substring that must exist in message for deletion
- `timeout` - timeout in ms before message deletion

Examples:

`` .add simple 1234 0 `` - deletes all messages by user with id `1234`, with no delay

`` .add match 1234 `alice` 1000 `` - deletes all messages by user with id `1234`,
that contain the word `alice` after 1 second.

## TODO

- [ ] wildcard arguments
- [ ] custom command prefix
- [ ] add rest of filter CRUD operations
- [ ] switch to slash commands

