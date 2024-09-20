import AboutPage from "../pages/About";
import { AttackVectors } from "../pages/AttackVectors";
import ReferencesPage from "../pages/References";
import ToolsPage from "../pages/Tools";
import { CVE202141773 } from "./CVE-2021-41773/CVE-2021-41773";
import CVE202144228 from "./CVE-2021-44228/CVE-2021-44228";
import CVE202236804 from "./CVE-2022-36804/CVE-2022-36804";
import DirbTool from "./DirbTool/DirbTool";
import FindOffset from "./FindOffset/FindOffset";
import Hashcat from "./Hashcat/Hashcat";
import JohnTheRipper from "./JohnTheRipper/JohnTheRipper";
import NmapTool from "./NmapTool/NmapTool";
import { ShodanAPITool } from "./Shodan/Shodan-API-Tool";
import SMBEnumeration from "./SMBEnumeration/SMBEnumeration";
import SnmpCheck from "./SnmpCheck/SnmpCheck";
import Hydra from "./Hydra/Hydra";
import Urlsnarf from "./Urlsnarf/Urlsnarf";
import { ZeroLogon } from "./ZeroLogon/Zerologon";
import SearchSploit from "./SearchSploit/SearchSploit";
import { WalkthroughsPage } from "../pages/Walkthroughs";
import SMBGhostScanner from "./SMBGhostScanner/SMBGhostScanner";
import ARPSpoofing from "./ArpSpoof/ArpSpoof";
import { CVE202224112 } from "./CVE-2022-24112/CVE-2022-24112";
import Enum4Linux from "./Enum4Linux/Enum4Linux";
import DnsenumTool from "./DNSenumTool/DNSenumTool";
import Metagoofil from "./metagoofil/metagoofil";
import Dmitry from "./Dmitry/Dmitry";
import DNSMap from "./DNSMap/DNSMap";
import Gyoithon from "./Gyoithon/Gyoithon";
import NbtscanTool from "./NbtscanTool/NbtscanTool";
import Cewl from "./Cewl/Cewl";
import NetcatTool from "./Netcat/Netcat";
import Sherlock from "./Sherlock/Sherlock";
import BEDTool from "./BedTool/BEDTool";
import Dnsrecon from "./Dnsrecon/Dnsrecon";
import Crackmapexec from "./Crackmapexec/Crackmapexec";
import FfufTool from "./Ffuf/FfufTool";
import Redeemer from "./WalkthroughPages/Redeemer";
import Fawn from "./WalkthroughPages/Fawn";
import Pentesting from "./WalkthroughPages/Pentesting";
import Traceroute from "./Traceroute/Traceroute";
import Crunch from "./Crunch/Crunch";
import Meow from "./WalkthroughPages/Meow";
import FTPconnect from "./FTP/FTPconnect";
import GoldenEye from "./Goldeneye/Goldeneye";
import WPScan from "./WPScan/WPScan";
import Eyewitness from "./eyewitness/eyewitness";
import MrRobot from "./WalkthroughPages/MrRobot";
import Parsero from "./parsero/parsero";
import Arjuntool from "./Arjuntool/Arjuntool";
import ARPFingerprint from "./arpfingerprint/arpfingerprint";
import ForemostTool from "./Foremost/Foremost";
import Busqueda from "./WalkthroughPages/Busqueda";
import TheHarvester from "./theharvester/theharvester";
import PayloadGenerator from "./msfvenom/msfvenom";
import AircrackNG from "./AircrackNG/AircrackNG";
import AirbaseNG from "./AirbaseNG/AirbaseNG";
import Fcrackzip from "./Fcrackzip/Fcrackzip";
import GoBusterTool from "./GobusterTool/Gobuster";
import Keeper from "./WalkthroughPages/Keeper";
import Monitorstwo from "./WalkthroughPages/Monitorstwo";
import Pilgrimage from "./WalkthroughPages/Pilgrimage";
import Racecar from "./WalkthroughPages/Racecar";
import Topology from "./WalkthroughPages/Topology";
import Persistence from "./WalkthroughPages/Persistence";
import RTsort from "./RTsort/RTsort";
import Rainbowcrack from "./Rainbowcrack/Rainbowcrack";
import NSLookup from "./NSLookupTool/NSLookupTool";
import ArpanameTool from "./Arpaname/arpaname";
import Nikto from "./Nikto/Nikto";
import TShark from "./TShark/TShark";
import Bully from "./Bully/Bully";
import AMAP from "./Amap/Amap";
import Gitleaks from "./Gitleaks/Gitleaks";
import WhatWeb from "./WhatWeb/WhatWeb";
import Sublist3r from "./Sublist3r/Sublist3r";
import Arpscan from "./ArpScan/ArpScan";
import Whois from "./Whois/Whois";
import Masscan from "./Masscan/Masscan";
import Hping3 from "./Hping3/Hping3";
import SQLmap from "./SQLmap/SQLmap";
import SlowHttpTest from "./slowhttptest/slowhttptest";
import Unicornscan from "./Unicornscan/Unicornscan";
import FirmwareAnalysisTool from "./FirmwareAnalysisTool/FirmwareAnalysisTool";

export interface RouteProperties {
    name: string;
    path: string;
    element: JSX.Element;
    description: string;
    category: string;
}

export const ROUTES: RouteProperties[] = [
    {
        name: "Home",
        path: "/",
        element: <AboutPage />,
        description: "Home page",
        category: "",
    },
    {
        name: "About",
        path: "/about",
        element: <AboutPage />,
        description: "About page",
        category: "",
    },
    {
        name: "Tools",
        path: "/tools",
        element: <ToolsPage />,
        description: "Tools page",
        category: "",
    },
    {
        name: "Attack Vectors",
        path: "/attack-vectors",
        element: <AttackVectors />,
        description: "Attack Vectors page",
        category: "",
    },
    {
        name: "Walkthroughs",
        path: "/walkthroughs",
        element: <WalkthroughsPage />,
        description: "Walkthroughs page",
        category: "",
    },
    {
        name: "References",
        path: "/references",
        element: <ReferencesPage />,
        description: "Attack Vectors page",
        category: "",
    },
    {
        name: "CVE-2021-41773",
        path: "/attack-vectors/cve-2021-41773",
        element: <CVE202141773 />,
        description: "Apache 2.4.49 and 2.4.50 RCE",
        category: "",
    },
    {
        name: "ZeroLogon",
        path: "/attack-vectors/ZeroLogon",
        element: <ZeroLogon />,
        description: "Zero Logon will let the penetester to perform an authentication attempts on windows server",
        category: "",
    },
    {
        name: "CVE-2021-44228",
        path: "/attack-vectors/cve-2021-44228",
        element: <CVE202144228 />,
        description: "Vulnerability in the Apache Log4j 2 Java library allowing RCE",
        category: "",
    },
    {
        name: "CVE-2022-36804",
        path: "/attack-vectors/cve-2022-36804",
        element: <CVE202236804 />,
        description: "Pre-Auth RCE in Atlassian Bitbucket Server Vulnerability",
        category: "",
    },
    {
        name: "Find offset",
        path: "/attack-vectors/find-offset",
        element: <FindOffset />,
        description: "Find the offset to the instruction pointer in a buffer overflow vulnerable binary.",
        category: "",
    },
    {
        name: "CVE-2022-24112",
        path: "/attack-vectors/cve-2022-24112",
        element: <CVE202224112 />,
        description: "Apache APISIX Remote Code Execution Vulnerability",
        category: "",
    },
    {
        name: "Busqueda",
        path: "/walkthroughs/Busqueda",
        element: <Busqueda />,
        description: "A walkthrough on the Busqueda Hack The Box challenge",
        category: "Miscellaneous",
    },
    {
        name: "Fawn",
        path: "/walkthroughs/Fawn",
        element: <Fawn />,
        description: "A walkthrough on the Fawn Hack The Box Challenge showcasing DDT nmap tool",
        category: "Miscellaneous",
    },
    {
        name: "Keeper",
        path: "/walkthroughs/Keeper",
        element: <Keeper />,
        description:
            "A walkthrough on the Keeper Hack The Box Challenge showcasing privilege escalation and web application security",
        category: "Web Application Testing",
    },
    {
        name: "Monitorstwo",
        path: "/walkthroughs/Monitorstwo",
        element: <Monitorstwo />,
        description:
            "A walkthrough on the Monitorstwo Hack The Box Challenge centered around network monitoring and intrusion detection systems",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Meow",
        path: "/walkthroughs/Meow",
        element: <Meow />,
        description:
            "A walkthrough on the Meow Hack The Box challenge involving basic enumeration and exploitation techniques to gain access to the target system.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "MrRobot",
        path: "/walkthroughs/MrRobot",
        element: <MrRobot />,
        description: "A walkthrough on the Mr Robot TryHackMe Capture the flag",
        category: "Miscellaneous",
    },
    {
        name: "Pentesting",
        path: "/walkthroughs/Pentesting",
        element: <Pentesting />,
        description: "A walkthrough on a Pentesting room with focus on brute force attack and privilege escalation",
        category: "Penetration Testing",
    },
    {
        name: "Persistence",
        path: "/walkthroughs/Persistence",
        element: <Persistence />,
        description:
            "A walkthrough on the Hack The Box challenge: Persistence is Key with focus on forensics investigation on an FTP server",
        category: "Information Gathering and Analysis",
    },
    {
        name: "Pilgrimage",
        path: "/walkthroughs/Pilgrimage",
        element: <Pilgrimage />,
        description:
            "A walkthrough on the Pilgrimage Hack The Box challenge focused on exploiting a web application vulnerability to gain access to the system",
        category: "Web Application Testing",
    },
    {
        name: "Racecar",
        path: "/walkthroughs/Racecar",
        element: <Racecar />,
        description:
            "A walkthrough on Racecar Hack The Box challenge utilizing cryptographic analysis and reverse engineering skills to decipher and exploit a custom encryption algorithm",
        category: "Information Gathering and Analysis",
    },
    {
        name: "Redeemer",
        path: "/walkthroughs/Redeemer",
        element: <Redeemer />,
        description:
            "A walkthrough on the Redeemer Hack The Box challenge showcasing enumeration and post-exploitation tasks, testing your expertise in penetration testing",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Topology",
        path: "/walkthroughs/Topology",
        element: <Topology />,
        description:
            "A walkthrough on Topology Hack The Box challenge which requires knowledge of network protocols, routing, and security configurations",
        category: "Network Scanning and Enumeration",
    },
    //TOOLS BELOW THIS COMMENT - PLEASE ADD NEW TOOLS IN ALPHABETICAL ORDER
    {
        name: "Airbase NG",
        path: "/tools/AirbaseNG",
        element: <AirbaseNG />,
        description:
            "A network attack tool that can create a fake access point (AP) to capture and analyze traffic from devices that connect to it.",
        category: "Wireless Attacks and Rogue Access Point Creation",
    },
    {
        name: "Aircrack NG",
        path: "/tools/AircrackNG",
        element: <AircrackNG />,
        description:
            "A wireless network auditing and cracking tool that can capture and analyze packets from Wi-Fi networks, crack WEP and WPA-PSK passwords, and identify vulnerabilities in wireless networks.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "AI-based pen-testing tool (Gyoithon)",
        path: "/tools/gyoithon",
        element: <Gyoithon />,
        description:
            "An AI-powered pen-testing tool that employs Naive Bayes and Deep Neural Network algorithms to detect HTTP/HTTPS ports",
        category: "Web Application Testing",
    },
    {
        name: "Amap",
        path: "/tools/Amap",
        element: <AMAP />,
        description: "A network scanning tool used to identify open ports and services on targeted hosts.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Arjun",
        path: "/tools/Arjuntool",
        element: <Arjuntool />,
        description:
            "A tool that helps find hidden GET & POST parameters for URL endpoints by analyzing web traffic and identifying possible query parameters",
        category: "Web Application Testing",
    },
    {
        name: "Arpaname",
        path: "/tools/Arpaname",
        element: <ArpanameTool />,
        description:
            "A web application tool to perform reverse DNS lookups for IP addresses, mapping them back to associated domain names.",
        category: "Web Application Testing",
    },
    {
        name: "ARP Fingerprint",
        path: "/tools/ARPFingerprint",
        element: <ARPFingerprint />,
        description:
            "A tool to analyse ARP (Address Resolution Protocol) traffic to identify the types of operating systems and network devices on a network.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "ArpScan",
        path: "/tools/arpscan",
        element: <Arpscan />,
        description: "A tool that uses ARP requests to discover devices on a local network.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "ARP Spoofing",
        path: "/tools/ARPSpoofing",
        element: <ARPSpoofing />,
        description:
            "A tool used to poison the ARP cache by falsifying MAC address mappings between two targets, enabling interception or manipulation of network traffic.",
        category: "Attack Tools",
    },
    {
        name: "BED",
        path: "/tools/bed",
        element: <BEDTool />,
        description:
            "A program designed to check network services (daemons) for potential vulnerabilities like buffer overflows and format string exploits.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "Bully",
        path: "/tools/bully",
        element: <Bully />,
        description: " A tool used for brute-forcing WPS PINs to gain unauthorized access to wireless networks.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Cewl",
        path: "/tools/Cewl",
        element: <Cewl />,
        description: "A tool that generates custom word lists by crawling and analyzing web pages for useful words.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Crackmapexec",
        path: "/tools/Crackmapexec",
        element: <Crackmapexec />,
        description:
            "A post-exploitation tool used for automating the assessment and exploitation of large Active Directory networks.",
        category: "Vulnerability Assessment and Exploitation",
    },
    {
        name: "Crunch",
        path: "/tools/Crunch",
        element: <Crunch />,
        description:
            "A tool used to generate custom wordlists based on specified patterns, character sets, and lengths.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Dirb",
        path: "/tools/Dirb",
        element: <DirbTool />,
        description: "A tool used for directory and file brute-forcing on web servers to discover hidden resources.",
        category: "Web Application Testing",
    },
    {
        name: "dmitry",
        path: "/tools/dmitry",
        element: <Dmitry />,
        description:
            "A tool for gathering information about a domain, including email addresses, subdomains, and IP addresses.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "DNSenum",
        path: "/tools/dnsenum",
        element: <DnsenumTool />,
        description:
            "A tool used to gather information about a domain's DNS, including subdomains, IP addresses, and DNS records.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "DNSMap",
        path: "/tools/dnsmap",
        element: <DNSMap />,
        description: "A tool that can visualize and analyze DNS records associated with a domain or IP address",
        category: "Information Gathering and Analysis",
    },
    {
        name: "DNSRecon",
        path: "/tools/Dnsrecon",
        element: <Dnsrecon />,

        description:
            "A Python script that systematically searches for different hosts associated with a given domain, using DNS queries to discover subdomains, IP addresses, and other relevant DNS records. ",

        category: "Information Gathering and Analysis",
    },
    {
        name: "Enum4Linux",
        path: "/tools/enum4linux",
        element: <Enum4Linux />,
        description:
            "A tool used to gather information from Windows machines using the SMB protocol, including user accounts and share details.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "EyeWitness",
        path: "/tools/eyewitness",
        element: <Eyewitness />,
        description: "A tool used for capturing screenshots and gathering information from web servers",
        category: "Web Application Testing",
    },
    {
        name: "Fcrackzip",
        path: "/tools/Fcrackzip",
        element: <Fcrackzip />,
        description: "A tool for cracking the password of a protected zip file",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "FFuf",
        path: "/tools/Ffuf",
        element: <FfufTool />,
        description:
            "A web fuzzer used for discovering hidden files, directories and endpoints on web servers by brute-forcing URLs.",
        category: "Web Application Testing",
    },
    {
        name: "FirmwareAnalysisTool",
        path: "/tools/FirmwareAnalysisTool",
        element: <FirmwareAnalysisTool />,
        description:
            "Firmware Analysis Toolkit (FAT henceforth) is based on Firmadyne with some changes. Firmadyne uses a PostgreSQL database to store information about the emulated images.",
        category: "IOT",
    },
    {
        name: "Foremost",
        path: "/tools/foremost",
        element: <ForemostTool />,
        description:
            "A tool used for file carving, which extracts specific types of files from disk images or data streams based on file headers and footers.",
        category: "File Analysis and Recovery",
    },
    {
        name: "FTPconnect",
        path: "/tools/FTPconnect",
        element: <FTPconnect />,
        description: "A tool used for connecting to and interacting with FTP servers",
        category: "Miscellaneous",
    },
    {
        name: "Gitleaks",
        path: "/tools/gitleaks",
        element: <Gitleaks />,
        description: "A tool used to detect sensitive information and secrets that may be exposed in Git repositories.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "GoBuster",
        path: "/tools/GoBusterTool",
        element: <GoBusterTool />,
        description:
            "A web directory brute-forcing tool that can discover hidden directories and files on web servers.",
        category: "Web Application Testing",
    },
    {
        name: "GoldenEye",
        path: "/tools/GoldenEye",
        element: <GoldenEye />,
        description:
            "A tool used for performing denial-of-service (DoS) attacks by simulating HTTP requests to overwhelm a web server.",
        category: "Attack Tools",
    },
    {
        name: "Hashcat",
        path: "/tools/hashcat",
        element: <Hashcat />,
        description:
            "A password recovery tool that uses brute-force, dictionary, and other attack methods to crack hashed passwords.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Hping3",
        path: "/tools/hping3",
        element: <Hping3 />,
        description:
            "Hping3 is a network packet crafting and analysis tool. It is used for testing firewalls, network performance, port scanning, and network auditing.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Hydra",
        path: "/tools/Hydra",
        element: <Hydra />,
        description:
            "A tool used for brute-forcing login credentials across various protocols, such as HTTP, FTP, and SSH.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "JohnTheRipper",
        path: "/tools/JohnTheRipper",
        element: <JohnTheRipper />,
        description: "A password cracking tool that supports various algorithms and methods to crack hashed passwords.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Masscan",
        path: "/tools/Masscan",
        element: <Masscan />,
        description: "Masscan is a quick and effective port scanning tool used for network reconnaissance.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Metagoofil",
        path: "/tools/metagoofil",
        element: <Metagoofil />,
        description:
            "A tool used for extracting metadata from documents found on web servers to gather information about potential targets.",
        category: "File Analysis and Recovery",
    },
    {
        name: "msfvenom",
        path: "/tools/msfvenom",
        element: <PayloadGenerator />,
        description:
            "A tool that can create payloads for various exploits and attack vectors, such as shellcode, Java applets, and executable files.",
        category: "Attack Tools",
    },
    {
        name: "Nbtscan",
        path: "/tools/nbtscan",
        element: <NbtscanTool />,
        description: "A tool used for scanning and identifying NetBIOS names and associated IP addresses on a network.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Netcat",
        path: "/tools/Netcat",
        element: <NetcatTool />,
        description: "A that can create, read, and write network connections using TCP or UDP protocols.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Nikto",
        path: "/tools/Nikto",
        element: <Nikto />,
        description:
            "A web server scanner that detects vulnerabilities, misconfigurations, and potential security issues in web applications.",
        category: "Web Application Testing",
    },
    {
        name: "Nmap",
        path: "/tools/nmap",
        element: <NmapTool />,
        description: "A network scanning tool used for discovering hosts, services, and vulnerabilities on a network.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "NSLookup",
        path: "/tools/nslookuptool",
        element: <NSLookup />,
        description: "A command-line tool used for querying DNS to obtain domain name or IP address information.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Parsero",
        path: "/tools/parsero",
        element: <Parsero />,
        description: "A Python script that reads a web server's robots.txt file to view and analyze Disallow entries.",
        category: "Web Application Testing",
    },
    {
        name: "RTsort",
        path: "/tools/RTsort",
        element: <RTsort />,
        description: "A subfunction of the Rainbow Crack tool used for sorting and managing created rainbow tables.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Rainbowcrack",
        path: "/tools/Rainbowcrack",
        element: <Rainbowcrack />,
        description: "A computer program which generates rainbow tables to be used in password cracking.",
        category: "Password cracking and Authentication testing",
    },
    {
        name: "SearchSploit",
        path: "/tools/SearchSploit",
        element: <SearchSploit />,
        description:
            "A utility that allows users to search through a vast database of exploits, shellcodes, and security-related papers.",
        category: "Vulnerabilityy Assessment and Exploitation",
    },
    {
        name: "Sherlock",
        path: "/tools/Sherlock",
        element: <Sherlock />,
        description: "A tool used to find and enumerate user accounts across various social media platforms.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "Shodan API tool",
        path: "/tools/shodan-api-tool",
        element: <ShodanAPITool />,
        description:
            "Shodan API allows for network scanning and querying of Shodan’s database to gather information about connected devices and their vulnerabilities.",
        category: "Vulnerability Assessment and Exploitation",
    },
    {
        name: "SMB Enumeration",
        path: "/tools/SMBEnumeration",
        element: <SMBEnumeration />,
        description:
            "A tool used to gather information about network shares, users, and other details from Windows machines using the SMB protocol.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "SMB-Ghost Scanner",
        path: "/tools/SMBGhostScanner",
        element: <SMBGhostScanner />,
        description: "A tool used to detect whether a target is vulnerable to the CVE-2020-0796 vulnerability in SMBv3",
        category: "Vulnerability Assessment and Exploitation",
    },
    {
        name: "SnmpCheck",
        path: "/tools/snmpcheck",
        element: <SnmpCheck />,
        description:
            "A tool used to identify and assess vulnerabilities in devices that use the SNMP protocol by querying SNMP information.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "SQLmap",
        path: "/tools/SQLmap",
        element: <SQLmap />,
        description:
            "SQLmap is a tool to detect and exploit SQL injection flaws and the taking over of database servers.",
        category: "Web Application Testing",
    },
    {
        name: "Sublist3r",
        path: "/tools/Sublist3r",
        element: <Sublist3r />,
        description:
            "A tool that can efficiently discover subdomains associated with a given domain using various techniques, such as DNS queries, Google search, and passive DNS records,",
        category: "Web Application Testing",
    },
    {
        name: "The Harvester",
        path: "/tools/theharvester",
        element: <TheHarvester />,
        description:
            "A tool used for gathering information from various public sources, such as search engines and social media, to find email addresses and domain details.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "Traceroute",
        path: "/tools/Traceroute",
        element: <Traceroute />,
        description:
            "A network diagnostic tool that tracks the path packets take as they travel from a source to a destination.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "TShark",
        path: "/tools/TShark",
        element: <TShark />,
        description: "A command-line network analyzer that can capture, analyze, and troubleshoot network traffic.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Urlsnarf",
        path: "/tools/Urlsnarf",
        element: <Urlsnarf />,
        description: "A tool used for capturing and logging HTTP requests and URLs transmitted over a network.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "WhatWeb",
        path: "/tools/WhatWeb",
        element: <WhatWeb />,
        description:
            "A tool used to identify and analyze web technologies, such as web servers and frameworks, used by websites.",
        category: "Web Application Testing",
    },
    {
        name: "Whois",
        path: "/tools/Whois",
        element: <Whois />,
        description:
            "A tool used to query and retrieve information about domain registrations, including registrants and contact details.",
        category: "Web Application Testing",
    },
    {
        name: "WPScan",
        path: "/tools/WPScan",
        element: <WPScan />,
        description:
            "A tool used to scan WordPress websites for vulnerabilities, security issues, and exposed sensitive information.",
        category: "Web Application Testing",
    },
];
export function getTools() {
    return ROUTES.filter((route) => route.path.startsWith("/tools/"));
}

export function getAttackVectors() {
    return ROUTES.filter((route) => route.path.startsWith("/attack-vectors/"));
}

export function getWalkthroughs() {
    return ROUTES.filter((route) => route.path.startsWith("/walkthroughs/"));
}
