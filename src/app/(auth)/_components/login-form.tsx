"use client";

import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import Logo from "#/components/globals/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Checkbox } from "#/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { authenticateUser } from "#/server/actions/user";
import { useRouter, useSearchParams } from "next/navigation";

type Country = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
};

// Countries data
const worldCountries: Country[] = [
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Cameroon", code: "CM", dialCode: "+237", flag: "🇨🇲" },
  { name: "Cape Verde", code: "CV", dialCode: "+238", flag: "🇨🇻" },

  { name: "Afghanistan", code: "AF", dialCode: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "AL", dialCode: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", dialCode: "+213", flag: "🇩🇿" },
  { name: "American Samoa", code: "AS", dialCode: "+1684", flag: "🇦🇸" },
  { name: "Andorra", code: "AD", dialCode: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "AO", dialCode: "+244", flag: "🇦🇴" },
  { name: "Anguilla", code: "AI", dialCode: "+1264", flag: "🇦🇮" },
  { name: "Antarctica", code: "AQ", dialCode: "+672", flag: "🇦🇶" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "+1268", flag: "🇦🇬" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", dialCode: "+374", flag: "🇦🇲" },
  { name: "Aruba", code: "AW", dialCode: "+297", flag: "🇦🇼" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "BS", dialCode: "+1242", flag: "🇧🇸" },
  { name: "Bahrain", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "BB", dialCode: "+1246", flag: "🇧🇧" },
  { name: "Belarus", code: "BY", dialCode: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "BZ", dialCode: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "BJ", dialCode: "+229", flag: "🇧🇯" },
  { name: "Bermuda", code: "BM", dialCode: "+1441", flag: "🇧🇲" },
  { name: "Bhutan", code: "BT", dialCode: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "BO", dialCode: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "BA", dialCode: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "BW", dialCode: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  {
    name: "British Indian Ocean Territory",
    code: "IO",
    dialCode: "+246",
    flag: "🇮🇴",
  },
  { name: "Brunei Darussalam", code: "BN", dialCode: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "BG", dialCode: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", dialCode: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "KH", dialCode: "+855", flag: "🇰🇭" },
  { name: "Cayman Islands", code: "KY", dialCode: "+1345", flag: "🇰🇾" },
  {
    name: "Central African Republic",
    code: "CF",
    dialCode: "+236",
    flag: "🇨🇫",
  },
  { name: "Chad", code: "TD", dialCode: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "CL", dialCode: "+56", flag: "🇨🇱" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "Christmas Island", code: "CX", dialCode: "+61", flag: "🇨🇽" },
  { name: "Cocos (Keeling) Islands", code: "CC", dialCode: "+61", flag: "🇨🇨" },
  { name: "Colombia", code: "CO", dialCode: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "KM", dialCode: "+269", flag: "🇰🇲" },
  { name: "Congo", code: "CG", dialCode: "+242", flag: "🇨🇬" },
  { name: "Cook Islands", code: "CK", dialCode: "+682", flag: "🇨🇰" },
  { name: "Costa Rica", code: "CR", dialCode: "+506", flag: "🇨🇷" },
  { name: "Cote d'Ivoire", code: "CI", dialCode: "+225", flag: "🇨🇮" },
  { name: "Croatia", code: "HR", dialCode: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "CU", dialCode: "+53", flag: "🇨🇺" },
  { name: "Cyprus", code: "CY", dialCode: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420", flag: "🇨🇿" },
  { name: "Denmark", code: "DK", dialCode: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "DJ", dialCode: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "DM", dialCode: "+1767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", dialCode: "+1849", flag: "🇩🇴" },
  { name: "Ecuador", code: "EC", dialCode: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "SV", dialCode: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "GQ", dialCode: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", dialCode: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "EE", dialCode: "+372", flag: "🇪🇪" },
  { name: "Ethiopia", code: "ET", dialCode: "+251", flag: "🇪🇹" },
  { name: "Falkland Islands", code: "FK", dialCode: "+500", flag: "🇫🇰" },
  { name: "Faroe Islands", code: "FO", dialCode: "+298", flag: "🇫🇴" },
  { name: "Fiji", code: "FJ", dialCode: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "French Guiana", code: "GF", dialCode: "+594", flag: "🇬🇫" },
  { name: "French Polynesia", code: "PF", dialCode: "+689", flag: "🇵🇫" },
  { name: "Gabon", code: "GA", dialCode: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", dialCode: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "GE", dialCode: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "GH", dialCode: "+233", flag: "🇬🇭" },
  { name: "Gibraltar", code: "GI", dialCode: "+350", flag: "🇬🇮" },
  { name: "Greece", code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { name: "Greenland", code: "GL", dialCode: "+299", flag: "🇬🇱" },
  { name: "Grenada", code: "GD", dialCode: "+1473", flag: "🇬🇩" },
  { name: "Guadeloupe", code: "GP", dialCode: "+590", flag: "🇬🇵" },
  { name: "Guam", code: "GU", dialCode: "+1671", flag: "🇬🇺" },
  { name: "Guatemala", code: "GT", dialCode: "+502", flag: "🇬🇹" },
  { name: "Guinea", code: "GN", dialCode: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", dialCode: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "GY", dialCode: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "HT", dialCode: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "HN", dialCode: "+504", flag: "🇭🇳" },
  { name: "Hong Kong", code: "HK", dialCode: "+852", flag: "🇭🇰" },
  { name: "Hungary", code: "HU", dialCode: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "IS", dialCode: "+354", flag: "🇮🇸" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "IR", dialCode: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", dialCode: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "IL", dialCode: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Jamaica", code: "JM", dialCode: "+1876", flag: "🇯🇲" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", dialCode: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "KZ", dialCode: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "KE", dialCode: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "KI", dialCode: "+686", flag: "🇰🇮" },
  {
    name: "Korea, Democratic People's Republic",
    code: "KP",
    dialCode: "+850",
    flag: "🇰🇵",
  },
  { name: "Korea, Republic of", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Kuwait", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", dialCode: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "LA", dialCode: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "LV", dialCode: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "LB", dialCode: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "LS", dialCode: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", dialCode: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "LY", dialCode: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "LI", dialCode: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", dialCode: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", dialCode: "+352", flag: "🇱🇺" },
  { name: "Macao", code: "MO", dialCode: "+853", flag: "🇲🇴" },
  { name: "Macedonia", code: "MK", dialCode: "+389", flag: "🇲🇰" },
  { name: "Madagascar", code: "MG", dialCode: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", dialCode: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", dialCode: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "ML", dialCode: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "MT", dialCode: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "MH", dialCode: "+692", flag: "🇲🇭" },
  { name: "Martinique", code: "MQ", dialCode: "+596", flag: "🇲🇶" },
  { name: "Mauritania", code: "MR", dialCode: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", dialCode: "+230", flag: "🇲🇺" },
  { name: "Mayotte", code: "YT", dialCode: "+262", flag: "🇾🇹" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "FM", dialCode: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "MD", dialCode: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", dialCode: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "MN", dialCode: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "ME", dialCode: "+382", flag: "🇲🇪" },
  { name: "Montserrat", code: "MS", dialCode: "+1664", flag: "🇲🇸" },
  { name: "Morocco", code: "MA", dialCode: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", dialCode: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "MM", dialCode: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "NA", dialCode: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "NR", dialCode: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "NP", dialCode: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "New Caledonia", code: "NC", dialCode: "+687", flag: "🇳🇨" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "NI", dialCode: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "NE", dialCode: "+227", flag: "🇳🇪" },
  { name: "Niue", code: "NU", dialCode: "+683", flag: "🇳🇺" },
  { name: "Norfolk Island", code: "NF", dialCode: "+672", flag: "🇳🇫" },
  {
    name: "Northern Mariana Islands",
    code: "MP",
    dialCode: "+1670",
    flag: "🇲🇵",
  },
  { name: "Norway", code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "PK", dialCode: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "PW", dialCode: "+680", flag: "🇵🇼" },
  { name: "Palestinian Territory", code: "PS", dialCode: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "PA", dialCode: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", dialCode: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "PY", dialCode: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "PE", dialCode: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", dialCode: "+63", flag: "🇵🇭" },
  { name: "Pitcairn", code: "PN", dialCode: "+64", flag: "🇵🇳" },
  { name: "Poland", code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Puerto Rico", code: "PR", dialCode: "+1939", flag: "🇵🇷" },
  { name: "Qatar", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Reunion", code: "RE", dialCode: "+262", flag: "🇷🇪" },
  { name: "Romania", code: "RO", dialCode: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "RW", dialCode: "+250", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "KN", dialCode: "+1869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", dialCode: "+1758", flag: "🇱🇨" },
  {
    name: "Saint Vincent and the Grenadines",
    code: "VC",
    dialCode: "+1784",
    flag: "🇻🇨",
  },
  { name: "Samoa", code: "WS", dialCode: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "SM", dialCode: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "ST", dialCode: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "SN", dialCode: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "RS", dialCode: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "SC", dialCode: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", dialCode: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Slovakia", code: "SK", dialCode: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", dialCode: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "SB", dialCode: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "SO", dialCode: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "South Sudan", code: "SS", dialCode: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "SD", dialCode: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "SR", dialCode: "+597", flag: "🇸🇷" },
  { name: "Swaziland", code: "SZ", dialCode: "+268", flag: "🇸🇿" },
  { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Syrian Arab Republic", code: "SY", dialCode: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "TW", dialCode: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", dialCode: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "TZ", dialCode: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "TL", dialCode: "+670", flag: "🇹🇱" },
  { name: "Togo", code: "TG", dialCode: "+228", flag: "🇹🇬" },
  { name: "Tokelau", code: "TK", dialCode: "+690", flag: "🇹🇰" },
  { name: "Tonga", code: "TO", dialCode: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "TT", dialCode: "+1868", flag: "🇹🇹" },
  { name: "Tunisia", code: "TN", dialCode: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", dialCode: "+993", flag: "🇹🇲" },
  {
    name: "Turks and Caicos Islands",
    code: "TC",
    dialCode: "+1649",
    flag: "🇹🇨",
  },
  { name: "Tuvalu", code: "TV", dialCode: "+688", flag: "🇹🇻" },
  { name: "Uganda", code: "UG", dialCode: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "UA", dialCode: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Uruguay", code: "UY", dialCode: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "UZ", dialCode: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "VU", dialCode: "+678", flag: "🇻🇺" },
  { name: "Venezuela", code: "VE", dialCode: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "VN", dialCode: "+84", flag: "🇻🇳" },
  {
    name: "Virgin Islands, British",
    code: "VG",
    dialCode: "+1284",
    flag: "🇻🇬",
  },
  { name: "Virgin Islands, U.S.", code: "VI", dialCode: "+1340", flag: "🇻🇮" },
  { name: "Wallis and Futuna", code: "WF", dialCode: "+681", flag: "🇼🇫" },
  { name: "Western Sahara", code: "EH", dialCode: "+212", flag: "🇪🇭" },
  { name: "Yemen", code: "YE", dialCode: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "ZM", dialCode: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", dialCode: "+263", flag: "🇿🇼" },
];

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    worldCountries[0]!,
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authResult, setAuthResult] = useState<{
    redirectUrl?: string;
    isRedirecting: boolean;
  }>({ isRedirecting: false });

  useEffect(() => {
    if (authResult.isRedirecting) {
      if (authResult.redirectUrl) {
        router.push(authResult.redirectUrl);
      } else if (callbackUrl) {
        router.push(decodeURIComponent(callbackUrl));
      } else {
        router.push("/dashboard");
      }
    }
  }, [authResult, router, callbackUrl]);

  const sanitizePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    return phone.replace(/\D/g, "");
  };

  const formatPhoneNumber = (phone: string): string => {
    // Format for display (can be customized based on country)
    const digits = sanitizePhoneNumber(phone);

    // Simple formatting example - can be enhanced with country-specific logic
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const sanitized = sanitizePhoneNumber(input);

    // Only update if it's empty or contains only digits
    if (input === "" || /^\d*$/.test(sanitized)) {
      setPhoneNumber(formatPhoneNumber(sanitized));
      // Clear error when user is typing
      if (error) setError(null);
    }
  };

  const isFormValid = useMemo(() => {
    const sanitized = sanitizePhoneNumber(phoneNumber);
    return sanitized.length >= 9 && sanitized.length <= 15 && termsAccepted;
  }, [phoneNumber, termsAccepted]);

  const handleCountrySelect = (countryCode: string) => {
    const country = worldCountries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      // Clear error when country changes
      if (error) setError(null);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const sanitized = sanitizePhoneNumber(phoneNumber);

        if (sanitized.length < 9) {
          throw new Error("Phone number is too short");
        }

        const result = await authenticateUser(sanitized, selectedCountry.code);

        if (!result.success) {
          throw new Error(result.message || "Authentication failed");
        }

        // Set redirecting state with the provided URL or let the useEffect handle the callback URL
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }
        setAuthResult({
          redirectUrl: result.redirectUrl,
          isRedirecting: true,
        });
      } catch (error) {
        console.error("Authentication failed:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Authentication failed. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [phoneNumber, selectedCountry],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-6">
            <a
              href="#"
              className="flex flex-col items-center gap-6 font-medium"
            >
              <Logo />
              <span className="sr-only">Numberspay.</span>
            </a>
            <h1 className="text-center text-4xl font-bold">
              Crypto with your phone number
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <div className="flex flex-col gap-3">
                <Select
                  value={selectedCountry.code}
                  onValueChange={handleCountrySelect}
                  disabled={isLoading || authResult.isRedirecting}
                >
                  <SelectTrigger className="w-full rounded-2xl">
                    <SelectValue>
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium">
                          {selectedCountry.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {selectedCountry.dialCode}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {worldCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{country.flag}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {country.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {country.dialCode}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                    className={cn(
                      "w-full",
                      error && "border-red-500 focus-visible:ring-red-500",
                    )}
                    required
                    disabled={isLoading || authResult.isRedirecting}
                    aria-invalid={!!error}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </div>
            </div>
            <div className="mt-4 flex cursor-pointer items-start space-x-2 duration-100 ease-in-out will-change-transform active:scale-[0.99]">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
                required
                disabled={isLoading || authResult.isRedirecting}
                className="h-5 w-5"
              />
              <Label htmlFor="terms" className="text-muted-foreground text-sm">
                I agree to the{" "}
                <a
                  href="#"
                  className="hover:text-primary underline underline-offset-4"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="hover:text-primary underline underline-offset-4"
                >
                  Privacy Policy
                </a>
                .
              </Label>
            </div>
            <Button
              type="submit"
              className="mt-8 w-full bg-indigo-600! text-white!"
              disabled={isLoading || !isFormValid || authResult.isRedirecting}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : authResult.isRedirecting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
