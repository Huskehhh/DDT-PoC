import AboutPage from "../pages/About";
import { AttackVectors } from "../pages/AttackVectors";
import ReferencesPage from "../pages/References";
import ToolsPage from "../pages/Tools";
import { CVE202141773 } from "./CVE-2021-41773/CVE-2021-41773";
import CVE202144228 from "./CVE-2021-44228/CVE-2021-44228";
import CVE202236804 from "./CVE-2022-36804/CVE-2022-36804";
import CVE20221388 from "./CVE-2022-1388/CVE-2022-1388";
import CVE202227925 from "./CVE-2022-27925/CVE-2022-27925";
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
import Exif from "./Exif/Exif";
import DnsenumTool from "./DNSenumTool/DNSenumTool";
import Metagoofil from "./metagoofil/metagoofil";
import Dmitry from "./Dmitry/Dmitry";
import DNSMap from "./DNSMap/DNSMap";
import Gyoithon from "./Gyoithon/Gyoithon";
import NbtscanTool from "./NbtscanTool/NbtscanTool";
import Cewl from "./Cewl/Cewl";
import CloudBrute from "./CloudBrute/CloudBrute";
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
import Amass from "./Amass/Amass";
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
import Rtgen from "./rtgen/rtgen";
import NSLookup from "./NSLookupTool/NSLookupTool";
import ArpanameTool from "./Arpaname/arpaname";
import Nikto from "./Nikto/Nikto";
import Bully from "./Bully/Bully";
import AMAP from "./Amap/Amap";
import Gitleaks from "./Gitleaks/Gitleaks";
import WhatWeb from "./WhatWeb/WhatWeb";
import Sublist3r from "./Sublist3r/Sublist3r";
import Arpscan from "./ArpScan/ArpScan";
import Whois from "./Whois/Whois";
import Masscan from "./Masscan/Masscan";
import TestSSL from "./Testssl/Testssl";
import Hping3 from "./Hping3/Hping3";
import SQLmap from "./SQLmap/SQLmap";
import Wifite from "./wifite/wifite";
import SlowHttpTest from "./slowhttptest/slowhttptest";
import Tiger from "./tiger/tiger";
import Unicornscan from "./Unicornscan/Unicornscan";
import Photon from "./Photon/photon";
import Arping from "./Arping/Arping";
import Sqlninja from "./Sqlninja/sqlninja";
import IPInsight from './IPInsight/IPInsight';
import CVE202226134 from "./CVE-2022-26134/CVE-2022-26134";
import Wafw00f from "./wafw00f/wafw00f";
import Fping from "./Fping/Fping";
import Subjack from "./Subjack/Subjack";

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
        name: "CVE-2022-1388",
        path: "/attack-vectors/cve-2022-1388",
        element: <CVE20221388 />,
        description: "Undisclosed requests may bypass iControl REST authentication.",
        category: "",
    },
    {
        name: "ZeroLogon",
        path: "/attack-vectors/ZeroLogon",
        element: <ZeroLogon />,
        description: "Zero Logon will let the pentester to perform an authentication attempts on windows server",
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
        name: "CVE-2022-27925",
        path: "/attack-vectors/cve-2022-27925",
        element: <CVE202227925 />,
        description:
            "Zimbra Collaboration (aka ZCS) 8.8.15 and 9.0 has mboximport functionality that receives a ZIP archive and extracts files from it.",
        category: "",
    },
    {
        name: "CVE-2022-26134",
        path: "/attack-vectors/cve-2022-26134",
        element: <CVE202226134 />,
        description: "Confluence Pre-Auth Remote Code Execution via OGNL Injection",
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
            "A walkthrough on the Pilgrimage Hack The Box challenge focused on exploiting a web application vulnerabilities to gain access to the system",
        category: "Web Application Testing",
    },
    {
        name: "Racecar",
        path: "/walkthroughs/Racecar",
        element: <Racecar />,
        description:
            "A walkthrough on Racecar Hack The Box challenge utilising cryptographic analysis and reverse engineering skills to decipher and exploit a custom encryption algorithm",
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
            "A network attack tool that can create a fake access point (AP) to capture and analyse traffic from devices that connect to it.",
        category: "Wireless Attacks and Rogue Access Point Creation",
    },
    {
        name: "Aircrack NG",
        path: "/tools/AircrackNG",
        element: <AircrackNG />,
        description:
            "A wireless network auditing tool designed for analysing packets captured from Wi-Fi networks, cracking WEP and WPA-PSK passwords, and identifying vulnerabilities in wireless networks.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Amap",
        path: "/tools/Amap",
        element: <AMAP />,
        description:
            "A network scanning tool designed to identify and fingerprint services and applications running on open ports of targeted hosts.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Amass",
        path: "/tools/Amass",
        element: <Amass />,
        description: "A tool for in-depth DNS enumeration and network mapping.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "Arjun",
        path: "/tools/Arjuntool",
        element: <Arjuntool />,
        description:
            "A tool that helps find hidden GET and POST parameters for URL endpoints by analysing web traffic and identifying potential query parameters.",
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
            "A tool to analyse ARP (Address Resolution Protocol) traffic and identify the types of operating systems and network devices on a network.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Arping",
        path: "/tools/Arping",
        element: <Arping />,
        description: "A tool used to send ARP requests to a specified IP address to discover the MAC address.",
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
        description: "A tool used for brute-forcing WPS PINs to gain unauthorised access to wireless networks.",
        category: "Network Scanning and Enumeration",
    },
    {
        name: "Cewl",
        path: "/tools/Cewl",
        element: <Cewl />,
        description: "A tool that generates custom word lists by crawling and analysing web pages for useful words.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "CloudBrute",
        path: "/tools/CloudBrute",
        element: <CloudBrute />,
        description:
            "A tool used for discovering cloud-based infrastructure and services across various cloud providers through enumeration techniques.",
        category: "Cloud Security and Reconnaissance",
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
        description: "A tool that can visualise and analyse DNS records associated with a domain or IP address",
        category: "Information Gathering and Analysis",
    },
    {
        name: "DNSRecon",
        path: "/tools/Dnsrecon",
        element: <Dnsrecon />,
        description:
            "A Python script that systematically searches for different hosts associated with a given domain, using DNS queries to discover subdomains, IP addresses, and other relevant DNS records.",
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
        name: "Exif",
        path: "/tools/Exif",
        element: <Exif />,
        description: "A tool used to extract metadata from different file types.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "EyeWitness",
        path: "/tools/eyewitness",
        element: <Eyewitness />,
        description:
            "A tool used to capture screenshots and gather information such as banners, headers, and other details from web servers.",
        category: "Web Application Testing",
    },
    {
        name: "Fcrackzip",
        path: "/tools/Fcrackzip",
        element: <Fcrackzip />,
        description: "A tool for cracking the password of a protected ZIP file.",
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
        name: "Foremost",
        path: "/tools/foremost",
        element: <ForemostTool />,
        description:
            "A tool used for file carving, which extracts specific types of files from disk images or data streams based on file headers and footers.",
        category: "File Analysis and Recovery",
    },
    {
        name: "Fping",
        path: "/tools/fping",
        element: <Fping />,
        description:
            "A tool used to send Internet Control Message Protocol echo requests to determine if a target host is responding.",
        category: "Web Application Testing",
    },
    {
        name: "FTPconnect",
        path: "/tools/FTPconnect",
        element: <FTPconnect />,
        description: "A tool used for connecting to and interacting with FTP servers.",
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
        description: "A web directory brute-forcing tool used to discover hidden directories and files on web servers.",
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
        name: "Gyoithon",
        path: "/tools/gyoithon",
        element: <Gyoithon />,
        description:
            "An AI-powered penetration testing tool designed to automate the discovery and exploitation of vulnerabilities in HTTP/HTTPS-based web applications.",
        category: "Web Application Testing",
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
            "A network packet crafting and analysis tool. It is used for testing firewalls, network performance, port scanning, and network auditing.",
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
        name: "IP Insight",
        path: "/tools/IPInsight",
        element: <IPInsight />,
        description:
            "Trace IP address details, including route, ownership, and location",
        category: "Network Tools",
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
        description: "A quick and effective port scanning tool used for network reconnaissance.",
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
        description: "A tool that can create, read, and write network connections using TCP or UDP protocols.",
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
        description: "A Python script that reads a web server's robots.txt file to view and analyse Disallow entries.",
        category: "Web Application Testing",
    },
    {
        name: "Photon",
        path: "/tools/photon",
        element: <Photon />,
        description: "A fast and flexible crawler designed for open source intelligence.",
        category: "Information Gathering and Analysis",
    },
    {
        name: "Rainbowcrack",
        path: "/tools/Rainbowcrack",
        element: <Rainbowcrack />,
        description: "A tool that uses rainbow tables to crack password hashes.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Rtgen",
        path: "/tools/rtgen",
        element: <Rtgen />,
        description: "A tool that generates rainbow tables to be used in password cracking.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "Rtsort",
        path: "/tools/RTsort",
        element: <RTsort />,
        description: "A subfunction of the Rainbow Crack tool used for sorting and managing created rainbow tables.",
        category: "Password Cracking and Authentication Testing",
    },
    {
        name: "SearchSploit",
        path: "/tools/SearchSploit",
        element: <SearchSploit />,
        description:
            "A utility that allows users to search through a vast database of exploits, shellcodes, and security-related papers.",
        category: "Vulnerability Assessment and Exploitation",
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
            "A tool used for network scanning and querying of Shodan's database to gather information about connected devices and their vulnerabilities.",
        category: "Vulnerability Assessment and Exploitation",
    },
    {
        name: "SlowHttpTest",
        path: "/tools/slowhttptest",
        element: <SlowHttpTest />,
        description: "A tool for simulating slow HTTP attacks to test web server resilience.",
        category: "Web Application Testing",
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
        description:
            "A tool used to detect whether a target is vulnerable to the CVE-2020-0796 vulnerability in SMBv3.",
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
        description: "A tool for detecting and exploiting SQL injection flaws and taking control of database servers.",
        category: "Web Application Testing",
    },
    {
        name: "Sqlninja",
        path: "/tools/sqlninja",
        element: <Sqlninja />,
        description:
            "A tool used to exploit SQL injection vulnerabilities on web applications that use Microsoft SQL Server as back end.",
        category: "Vulnerability Assessment and Exploitation",
    },
    {
        name: "Subjack",
        path: "/tools/Subjack",
        element: <Subjack />,
        description: "Subdomain takeover detection tool.",
        category: "Web Application Testing",
    },
    {
        name: "Sublist3r",
        path: "/tools/Sublist3r",
        element: <Sublist3r />,
        description:
            "A tool that can efficiently discover subdomains associated with a given domain using various techniques, such as DNS queries, Google search, and passive DNS records.",
        category: "Web Application Testing",
    },
    {
        name: "Testssl",
        path: "/tools/Testssl",
        element: <TestSSL />,
        description:
            "A versatile command-line tool designed to check a server's SSL/TLS configuration and identify potential vulnerabilities.",
        category: "Network Scanning and Enumeration",
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
        name: "Tiger",
        path: "/tools/tiger",
        element: <Tiger />,
        description: "An audit and intrusion detection tool used to protect UNIX based systems.",
        category: "Vulnerability Assessment and Exploitation",
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
        name: "Unicornscan",
        path: "/tools/Unicornscan",
        element: <Unicornscan />,
        description:
            "A tool used for scanning servers and hosts to identify open ports and services being utilised for network communications.",
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
        name: "Wafw00f",
        path: "/tools/wafw00f",
        element: <Wafw00f />,
        description: "A tool for detecting and fingerprinting web application firewalls (WAFs).",
        category: "Web Application Testing",
    },
    {
        name: "WhatWeb",
        path: "/tools/WhatWeb",
        element: <WhatWeb />,
        description:
            "A tool for identifying and analysing the web technologies used by websites, including web servers and frameworks.",
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
        name: "Wifite",
        path: "/tools/wifite",
        element: <Wifite />,
        description: "A tool used to audit WEP, WPA, and WPA2 encrypted networks.",
        category: "Network Scanning and Enumeration",
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
