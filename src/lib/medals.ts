// to centre text:
// dominant-baseline="middle" text-anchor="middle" x="50%"

type MedalFunction = (props: { bgColor: string; icon: string }) => string;

const firstPlaceMedal: MedalFunction = ({
  icon,
  bgColor,
}) => `<svg width="308" height="308" viewBox="0 0 308 308" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="#${bgColor}"/>
  <path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="url(#paint0_radial_661_618)" fill-opacity="0.2"/>
  <path d="M140.461 102.751C149.124 97.7496 159.798 97.7496 168.461 102.751L206.923 124.957C215.586 129.959 220.923 139.202 220.923 149.206V298.325C220.923 302.177 216.75 304.583 213.416 302.652L159.975 271.694C156.565 269.718 152.358 269.718 148.947 271.694L95.5063 302.652C92.173 304.583 88 302.177 88 298.325V149.206C88 139.202 93.3368 129.959 102 124.957L140.461 102.751Z" fill="url(#paint1_radial_661_618)"/>
  <text fill="#443252" xml:space="preserve" style="white-space: pre" font-family="GT Walsheim Pro" font-size="139.4" font-weight="bold" letter-spacing="0em"><tspan x="57.3476" y="126.654">${icon}</tspan></text>
  <path d="M140.453 50.1464C149.14 45.1084 159.86 45.1084 168.547 50.1464L237.109 89.9081C245.746 94.9169 251.062 104.146 251.062 114.13V193.87C251.062 203.854 245.746 213.083 237.109 218.092L168.547 257.854C159.86 262.892 149.14 262.892 140.453 257.854L71.8912 218.092C63.2544 213.083 57.9382 203.854 57.9382 193.87V114.13C57.9382 104.146 63.2544 94.9169 71.8912 89.9081L140.453 50.1464Z" fill="url(#paint2_linear_661_618)"/>
  <path opacity="0.8" d="M149.403 196H170.011V108.96H152.091C152.091 119.712 148.251 124.704 130.971 124.704V140.96H149.403V196Z" fill="#443252"/>
  <defs>
  <radialGradient id="paint0_radial_661_618" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(154 154) scale(145.5 126.007)">
  <stop offset="0.697917"/>
  <stop offset="0.916667" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="paint1_radial_661_618" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(154.461 156.5) rotate(90) scale(146.5 128.158)">
  <stop offset="0.425155" stop-color="#B8124A"/>
  <stop offset="0.924078" stop-color="#FF74A6"/>
  </radialGradient>
  <linearGradient id="paint2_linear_661_618" x1="154.5" y1="42" x2="154.5" y2="266" gradientUnits="userSpaceOnUse">
  <stop stop-color="#FFF6BB"/>
  <stop offset="1" stop-color="#E99667"/>
  </linearGradient>
  </defs>
  </svg>
`;

const secondPlaceMedal: MedalFunction = ({
  icon,
  bgColor,
}) => `<svg width="308" height="308" viewBox="0 0 308 308" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="#${bgColor}"/>
<path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="url(#paint0_radial_683_724)" fill-opacity="0.2"/>
<path d="M140.461 102.751C149.124 97.7496 159.798 97.7496 168.461 102.751L206.923 124.957C215.586 129.959 220.923 139.202 220.923 149.206V298.325C220.923 302.177 216.75 304.583 213.416 302.652L159.975 271.694C156.565 269.718 152.358 269.718 148.947 271.694L95.5063 302.652C92.173 304.583 88 302.177 88 298.325V149.206C88 139.202 93.3368 129.959 102 124.957L140.461 102.751Z" fill="url(#paint1_radial_683_724)"/>
<text fill="#443252" xml:space="preserve" style="white-space: pre" font-family="GT Walsheim Pro" font-size="139.4" font-weight="bold" letter-spacing="0em"><tspan x="57.3476" y="126.654">${icon}</tspan></text>
<path d="M140.453 50.1464C149.14 45.1084 159.86 45.1084 168.547 50.1464L237.109 89.9081C245.746 94.9169 251.062 104.146 251.062 114.13V193.87C251.062 203.854 245.746 213.083 237.109 218.092L168.547 257.854C159.86 262.892 149.14 262.892 140.453 257.854L71.8912 218.092C63.2544 213.083 57.9382 203.854 57.9382 193.87V114.13C57.9382 104.146 63.2544 94.9169 71.8912 89.9081L140.453 50.1464Z" fill="url(#paint2_linear_683_724)"/>
<path opacity="0.8" d="M120.501 196H187.061V179.104H145.973C147.637 173.088 150.197 170.272 157.621 166.176L170.549 159.264C181.813 153.376 187.829 144.032 187.829 132.768C187.829 116.768 175.925 107.04 155.957 107.04C135.733 107.04 122.421 119.328 122.421 138.144H143.541C143.541 128.416 148.021 123.04 156.085 123.04C162.357 123.04 166.581 127.264 166.581 133.536C166.581 139.424 163.381 144.032 156.981 147.36L143.029 154.656C127.029 162.976 120.501 175.008 120.501 196Z" fill="#443252"/>
<defs>
<radialGradient id="paint0_radial_683_724" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(154 154) scale(145.5 126.007)">
<stop offset="0.697917"/>
<stop offset="0.916667" stop-opacity="0"/>
</radialGradient>
<radialGradient id="paint1_radial_683_724" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(154.461 156.5) rotate(90) scale(146.5 128.158)">
<stop offset="0.425155" stop-color="#443252"/>
<stop offset="0.924078" stop-color="#1BABFC"/>
</radialGradient>
<linearGradient id="paint2_linear_683_724" x1="154.5" y1="42" x2="154.5" y2="266" gradientUnits="userSpaceOnUse">
<stop stop-color="#D3DDE6"/>
<stop offset="1" stop-color="#9199AC"/>
</linearGradient>
</defs>
</svg>
`;

const thirdPlaceMedal: MedalFunction = ({
  icon,
  bgColor,
}) => `<svg width="308" height="308" viewBox="0 0 308 308" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="#${bgColor}"/>
<path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="url(#paint0_radial_683_737)" fill-opacity="0.2"/>
<path d="M140.461 102.751C149.124 97.7496 159.798 97.7496 168.461 102.751L206.923 124.957C215.586 129.959 220.923 139.202 220.923 149.206V298.325C220.923 302.177 216.75 304.583 213.416 302.652L159.975 271.694C156.565 269.718 152.358 269.718 148.947 271.694L95.5063 302.652C92.173 304.583 88 302.177 88 298.325V149.206C88 139.202 93.3368 129.959 102 124.957L140.461 102.751Z" fill="url(#paint1_radial_683_737)"/>
<text fill="#443252" xml:space="preserve" style="white-space: pre" font-family="GT Walsheim Pro" font-size="139.4" font-weight="bold" letter-spacing="0em"><tspan x="57.3476" y="126.654">${icon}</tspan></text>
<path d="M140.453 50.1464C149.14 45.1084 159.86 45.1084 168.547 50.1464L237.109 89.9081C245.746 94.9169 251.062 104.146 251.062 114.13V193.87C251.062 203.854 245.746 213.083 237.109 218.092L168.547 257.854C159.86 262.892 149.14 262.892 140.453 257.854L71.8912 218.092C63.2544 213.083 57.9382 203.854 57.9382 193.87V114.13C57.9382 104.146 63.2544 94.9169 71.8912 89.9081L140.453 50.1464Z" fill="url(#paint2_linear_683_737)"/>
<path opacity="0.8" d="M154.016 197.92C174.496 197.92 187.808 187.04 187.808 171.296C187.808 160.416 181.152 152.608 170.272 150.56C180.896 147.616 186.272 140.704 186.272 131.232C186.272 116.384 173.728 107.04 154.912 107.04C134.048 107.04 121.504 118.048 121.504 134.688H141.984C141.984 127.008 146.72 122.4 154.4 122.4C161.056 122.4 165.536 126.368 165.536 132.256C165.536 139.424 161.44 142.88 153.248 142.88H144.416V158.752H153.12C162.08 158.752 166.816 162.592 166.816 170.4C166.816 177.184 161.952 181.664 154.4 181.664C145.568 181.664 140.448 176.544 140.448 167.328H119.584C119.584 186.912 131.744 197.92 154.016 197.92Z" fill="#443252"/>
<defs>
<radialGradient id="paint0_radial_683_737" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(154 154) scale(145.5 126.007)">
<stop offset="0.697917"/>
<stop offset="0.916667" stop-opacity="0"/>
</radialGradient>
<radialGradient id="paint1_radial_683_737" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(154.461 156.5) rotate(90) scale(146.5 128.158)">
<stop offset="0.425155" stop-color="#B82612"/>
<stop offset="0.924078" stop-color="#FF7474"/>
</radialGradient>
<linearGradient id="paint2_linear_683_737" x1="154.5" y1="42" x2="154.5" y2="266" gradientUnits="userSpaceOnUse">
<stop stop-color="#F7D2BD"/>
<stop offset="1" stop-color="#FF8074"/>
</linearGradient>
</defs>
</svg>
`;

const lastPlaceMedal: MedalFunction = ({
  icon,
  bgColor,
}) => `<svg width="308" height="308" viewBox="0 0 308 308" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="#${bgColor}"/>
<path d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z" fill="url(#paint0_radial_689_94)" fill-opacity="0.2"/>
<text fill="#443252" xml:space="preserve" style="white-space: pre" font-family="GT Walsheim Pro" font-size="139.4" font-weight="bold" letter-spacing="0em"><tspan x="57.3476" y="126.654">${icon}</tspan></text>
<path d="M140.453 50.1464C149.14 45.1084 159.86 45.1084 168.547 50.1464L237.109 89.9081C245.746 94.9169 251.062 104.146 251.062 114.13V193.87C251.062 203.854 245.746 213.083 237.109 218.092L168.547 257.854C159.86 262.892 149.14 262.892 140.453 257.854L71.8912 218.092C63.2544 213.083 57.9382 203.854 57.9382 193.87V114.13C57.9382 104.146 63.2544 94.9169 71.8912 89.9081L140.453 50.1464Z" fill="url(#paint1_linear_689_94)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M145.421 130.211L166.836 119.164C169.652 117.711 170.692 114.205 169.122 111.452C165.099 104.395 159.381 98.4505 152.484 94.1565L148.611 91.7451C145.801 89.9951 142.2 92.2102 142.494 95.5078C143.315 104.695 140.303 113.813 134.173 120.704L129.833 125.583C126.379 129.465 129.317 134.876 133.586 135.297L124.177 139.341C120.464 140.936 117.904 144.415 117.486 148.435C116.869 154.352 120.853 159.2 125.971 160.45L114.7 164.484C109.658 166.288 106.45 171.248 106.874 176.587C106.968 177.77 107.228 178.89 107.627 179.928C107.333 181.019 107.223 182.179 107.328 183.367C107.792 188.621 112.306 192.582 117.576 192.359L190.271 189.292C197.396 188.991 203.017 183.128 203.017 175.997C203.017 167.928 195.893 161.716 187.899 162.814L178.294 164.134L186.604 160.743C192.205 158.457 194.663 151.878 191.933 146.48C189.576 141.82 184.118 139.643 179.201 141.403L156.722 149.446L173.819 141.959C179.425 139.503 181.951 132.946 179.439 127.365C176.975 121.89 170.577 119.401 165.061 121.771L145.421 130.211Z" fill="black" fill-opacity="0.4"/>
<defs>
<radialGradient id="paint0_radial_689_94" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(154 154) scale(145.5 126.007)">
<stop offset="0.697917"/>
<stop offset="0.916667" stop-opacity="0"/>
</radialGradient>
<linearGradient id="paint1_linear_689_94" x1="154.5" y1="42" x2="154.5" y2="266" gradientUnits="userSpaceOnUse">
<stop stop-color="#C5BEBA"/>
<stop offset="1" stop-color="#4E3F3E"/>
</linearGradient>
</defs>
</svg>
`;

const placeHolo: MedalFunction =
  () => `<svg width="308" height="308" viewBox="0 0 308 308" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M167.609 49.7785C158.922 44.7405 148.202 44.7405 139.515 49.7785L70.953 89.5402C62.3163 94.549 57 103.778 57 113.762V193.502C57 203.486 62.3163 212.715 70.953 217.724L139.515 257.486C148.202 262.524 158.922 262.524 167.609 257.486L236.171 217.724C244.807 212.715 250.124 203.486 250.124 193.502V113.762C250.124 103.778 244.807 94.549 236.171 89.5402L167.609 49.7785ZM165.042 64.4776L224.944 99.2321C232.036 103.347 236.402 110.927 236.402 119.126V188.874C236.402 197.074 232.036 204.653 224.944 208.768L165.042 243.523C157.905 247.664 149.095 247.664 141.958 243.523L82.056 208.768C74.9637 204.653 70.5984 197.074 70.5984 188.874V119.126C70.5984 110.927 74.9637 103.347 82.056 99.2321L141.958 64.4776C149.095 60.3363 157.905 60.3363 165.042 64.4776ZM139.448 60.1528C148.138 55.1112 158.862 55.1112 167.552 60.1528L227.453 94.9073C236.087 99.9168 241.402 109.144 241.402 119.126V188.874C241.402 198.856 236.087 208.083 227.453 213.093L167.552 247.847C158.862 252.889 148.138 252.889 139.448 247.847L79.5468 213.093C70.9127 208.083 65.5984 198.856 65.5984 188.874V119.126C65.5984 109.144 70.9127 99.9168 79.5468 94.9073L139.448 60.1528Z" fill="black"/>
  </svg>  
`;

const medals: Record<string, MedalFunction> = {
  'first-place': firstPlaceMedal,
  'first-place_holo': placeHolo,
  'second-place': secondPlaceMedal,
  'second-place_holo': placeHolo,
  'third-place': thirdPlaceMedal,
  'third-place_holo': placeHolo,
  'last-place': lastPlaceMedal,
  'last-place_holo': placeHolo,
};
export default medals;
