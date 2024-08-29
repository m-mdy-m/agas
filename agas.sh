#!/bin/bash

# Function to send an HTTP request
function send_request() {
    local method=$1
    local url=$2
    local headers=()
    local data=""
    shift 2

    # Parse additional options
    while [[ $# -gt 0 ]]; do
        case $1 in
            -H|--header)
                headers+=("-H" "$2")
                shift 2
                ;;
            -d|--data)
                data="$2"
                shift 2
                ;;
            -t|--type)
                case $2 in
                    json) headers+=("-H" "Content-Type: application/json") ;;
                    html) headers+=("-H" "Content-Type: text/html") ;;
                    text) headers+=("-H" "Content-Type: text/plain") ;;
                    *) echo "Unknown type: $2"; exit 1 ;;
                esac
                shift 2
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Ensure the data is properly quoted for curl
    if [[ -n "$data" ]]; then
        # Use printf to escape quotes and handle special characters in JSON
        curl -X "$method" "${headers[@]}" --data "$data" "$url"
    else
        curl -X "$method" "${headers[@]}" "$url"
    fi
}
method=""
case $1 in
    @get) method="GET" ;;
    @post) method="POST" ;;
    @put) method="PUT" ;;
    @delete) method="DELETE" ;;
    @patch) method="PATCH" ;;
    @all) method="POST" ;;  # Used for GraphQL or multi-purpose POST
    *) echo "Unknown method: $1"; exit 1 ;;
esac

shift 1
send_request "$method" "$@"