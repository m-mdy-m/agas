#!/bin/bash

# Preset file to save/load requests
PRESETS_FILE="./presets.json"

# Function to send an HTTP request
function send_request() {
    local method=$1
    local url=$2
    local headers=()
    local data=""
    local verbose=false
    local silent=false
    local save=false
    local preset=""
    local output_format=""
    
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
            --verbose)
                verbose=true
                shift 1
                ;;
            --silent)
                silent=true
                shift 1
                ;;
            --preset)
                preset="$2"
                load_preset "$preset"
                shift 2
                ;;
            --save)
                save=true
                shift 1
                ;;
            --format)
                output_format="$2"
                shift 2
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Construct the curl command
    local curl_command=("curl" "-X" "$method" "${headers[@]}" "$url")
    
    # Add data if available
    if [[ -n "$data" ]]; then
        curl_command+=("--data" "$data")
    fi

    # Execute curl and handle output formats
    if [[ $silent == true ]]; then
        "${curl_command[@]}" -s
    elif [[ $verbose == true ]]; then
        echo "Executing request:"
        echo "Method: $method"
        echo "URL: $url"
        echo "Headers: ${headers[@]}"
        echo "Data: $data"
        "${curl_command[@]}"
    else
        response=$("${curl_command[@]}" -s)
        # Format the response output if jq or other formats are selected
        case $output_format in
            jq) echo "$response" | jq ;;
            raw) echo "$response" ;;
            *) echo "$response" ;;
        esac
    fi

    # Save request if required
    if [[ $save == true ]]; then
        save_preset "$method" "$url" "${headers[@]}" "$data"
    fi
    
    # Print a newline after the response
    echo
}

# Function to save a preset to a JSON file
function save_preset() {
    local method=$1
    local url=$2
    shift 2
    local headers=$1
    local data=$2

    jq -n --arg method "$method" --arg url "$url" --arg headers "$headers" --arg data "$data" \
    '{method: $method, url: $url, headers: $headers, data: $data}' > "$PRESETS_FILE"
    
    echo "Preset saved successfully."
}

# Function to load a preset from a JSON file
function load_preset() {
    local preset_name=$1
    if [[ -f "$PRESETS_FILE" ]]; then
        method=$(jq -r '.method' "$PRESETS_FILE")
        url=$(jq -r '.url' "$PRESETS_FILE")
        headers=$(jq -r '.headers' "$PRESETS_FILE")
        data=$(jq -r '.data' "$PRESETS_FILE")
        echo "Preset $preset_name loaded: $method $url"
    else
        echo "No preset found."
        exit 1
    fi
}

# Determine the HTTP method
method=""
case $1 in
    @get) method="GET" ;;
    @post) method="POST" ;;
    @put) method="PUT" ;;
    @delete) method="DELETE" ;;
    @patch) method="PATCH" ;;
    *) echo "Unknown method: $1"; exit 1 ;;
esac

shift 1
send_request "$method" "$@"