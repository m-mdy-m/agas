#!/bin/bash
function type_effect() {
    local text="$1"
    local delay=0.05  

    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep $delay
    done
    echo ""
}

function display_intro() {
        echo -e "\033[1;32m"
        type_effect "============================="
        type_effect "|                           |"
        type_effect "|   ~ Welcome to Agas! ~    |"
        type_effect "|                           |"
        type_effect "============================="
        type_effect "Initiating... Please wait while we pretend to care."
        sleep 1  # Pause for dramatic effect
        
        echo -e "\033[1;33m"
        cat << 'EOF'
         ._                __.
        / \"-.          ,-",'/ 
       (   \ ,"--.__.--".,' /  
       =---Y(_i.-'  |-.i_)---=
      f ,  "..'/\\v/|/|/\  , l
      l//  ,'|/   V / /||  \\j
       "--; / db     db|/---"
          | \ YY   , YY//
          '.\>_   (_),"' __
        .-"    "-.-." I,"  `.
        \.-""-. ( , ) ( \   |
        (     l  `"'  -'-._j 
 __,---_ '._." .  .    \
(__.--_-'.  ,  :  '  \  '-.
    ,' .'  /   |   \  \  \ "-
     "--.._____t____.--'-""'
            /  /  `. ".
           / ":     \' '.
         .'  (       \   : 
         |    l      j    "-.
         l_;_;I      l____;_I
EOF
        echo -e "\033[0m"

        sleep 1
        echo -e "\033[1;31m" 
        type_effect "Welcome to Agas, where your incompetence meets its reckoning!"
        type_effect "Agas will handle your HTTP requests... because clearly, you can't."
        sleep 0.5
        echo -e "\033[0m" 

        echo -e "\033[1;32m"
        type_effect "Agas is here to do the dirty work for you, because let's face it..."
        type_effect "You’re barely holding this whole 'coding' thing together."
        sleep 0.5
        echo -e "\033[1;32m"

        type_effect "So, sit back, rookie. Watch Agas destroy your pitiful excuses for HTTP requests."
        type_effect "Maybe, just maybe, you'll learn something useful for once."
        echo -e "\033[0m"
        echo
        touch "$intro_file"
}
function formatoutput() {
    local method=$1
    local url=$2
    local headers=("${!3}")
    local data=$4
    local response_body=$5
    local response_headers=$6
    local status_code=$7
    local size=$8
    local time=$9
    local output_format=${10}
    local verbose=${11}

    # Define colors
    local COLOR_HEADER="\033[1;34m"  # Blue
    local COLOR_BODY="\033[0;32m"    # Green
    local COLOR_STATUS="\033[1;33m"  # Yellow
    local COLOR_RESET="\033[0m"      # Reset

    # Prepare headers for display
    local display_headers=()
    for ((i = 0; i < ${#headers[@]}; i+=2)); do
        display_headers+=("${headers[i+1]}")
    done

    # Display request details
    echo -e "${BLOCK}──────────────────────────────────${COLOR_RESET}"
    echo -e "${COLOR_HEADER} REQUEST DETAILS ${COLOR_RESET}"
    echo -e "${COLOR_BODY}Method:         ${method}${COLOR_RESET}"
    echo -e "${COLOR_BODY}URL:            ${url}${COLOR_RESET}"
    echo -e "${COLOR_BODY}Headers:        ${display_headers[@]}${COLOR_RESET}"
    echo -e "${COLOR_BODY}Data:           ${data}${COLOR_RESET}"
    echo
    if [[ $verbose == true ]]; then
        echo -e "${BLOCK}───────────────────────────────────────────────────────────────${COLOR_RESET}"
        echo -e "${COLOR_HEADER} VERBOSE OUTPUT ${COLOR_RESET}"
        echo -e "${BLOCK}───────────────────────────────────────────────────────────────${COLOR_RESET}"
        echo -e "${COLOR_BODY}Executing curl command: ${curl_command[@]}${COLOR_RESET}"
    fi

    # Display response details
    echo -e "${BLOCK}──────────────────────────────────${COLOR_RESET}"
    echo -e "${COLOR_HEADER} RESPONSE DETAILS ${COLOR_RESET}"
    echo -e "${COLOR_STATUS}Status Code:    ${status_code}${COLOR_RESET}"
    echo -e "${COLOR_STATUS}Size:           ${size} bytes${COLOR_RESET}"
    echo -e "${COLOR_STATUS}Time:           ${time} seconds${COLOR_RESET}"
    echo

    # Format response body
    echo -e "${BLOCK}──────────────────────────────────${COLOR_RESET}"
    echo -e "${COLOR_HEADER} RESPONSE BODY ${COLOR_RESET}"
    case $output_format in
        jq)
            echo "$response_body" | jq
            ;;
        raw)
            echo "$response_body"
            ;;
        *)
            echo "$response_body"
            ;;
    esac

    echo -e "${BLOCK}──────────────────────────────────${COLOR_RESET}"
}
function extract() {
    local curl_command=("$@")
    
    # Temporary files for headers and body
    local header_file=$(mktemp)
    local body_file=$(mktemp)
    local output_file=$(mktemp)

    # Execute curl command
    curl -L -X "${curl_command[@]}" \
         -o "$body_file" \
         -D "$header_file" \
         -w "HTTP Code: %{http_code}\nSize: %{size_download} bytes\nTime: %{time_total}\n" \
         --silent \
         > "$output_file"

    # Extract response body
    local response_body=$(cat "$body_file")
    local response_headers=$(cat "$header_file")
    local status_code=$(grep "HTTP Code:" "$output_file" | awk '{print $3}')
    local size=$(grep "Size:" "$output_file" | awk '{print $2}')
    local time=$(grep "Time:" "$output_file" | awk '{print $2}')
    # Clean up temporary files
    rm "$header_file" "$body_file" "$output_file"
    # Call formatoutput with the extracted information
    formatoutput "$method" "$url" headers[@] "$data" "$response_body" "$response_headers" "$status_code" "$size" "$time" "$output_format" "$verbose"
}


function send_request() {
    local method=$1
    local url=$2
    local headers=()
    local data=""
    local verbose=false
    local silent=false
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
    local curl_command=("curl" "-X" "$method" "$url")
    
    # Add headers if available
    if [[ ${#headers[@]} -gt 0 ]]; then
        curl_command+=("${headers[@]}")
    fi

    # Add data if available
    if [[ -n "$data" ]]; then
        curl_command+=("--data" "$data")
    fi

    # Execute the request and capture the response
    if [[ $silent == true ]]; then
        response=$( "${curl_command[@]}" -s )
        echo "$response"
    else
        extract "${curl_command[@]}"
    fi
}
if [ "$#" -eq 0 ] || [[ "$@" == *"Agas"* || "$@" == *"agas"* ]]; then
    display_intro
    exit 0
fi
# Determine the HTTP method
method=""
case $1 in
    @get) method="GET" ;;
    @post) method="POST" ;;
    @put) method="PUT" ;;
    @delete) method="DELETE" ;;
    *) echo "Unknown method: $1"; exit 1 ;;
esac

shift 1
send_request "$method" "$@"