PROJECTNAME=$(shell basename "$(PWD)")

## help: List available command
help: Makefile
	@echo " Choose a command run in "$(PROJECTNAME)":"
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'

## build: Compile the binary.
build:
	@echo ">> Building APP..."
	@CGO_ENABLED=0 go build -o ./bin/ws ./
	@echo ">> Finished"

## run: Execute the binary file.
run: 
	./bin/ws

start: build run
