import { Svg, Path } from 'react-native-svg';
interface Sizing {
  width: number;
  height: number;
  color?: string;
}

export const HomeIcon = ({ width, height, color }: Sizing) => {
  return (
    <>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        //   xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        ></Path>
        <Path
          d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        ></Path>
      </Svg>
    </>
  );
};

export const SearchIcon = ({ width, height, color }: Sizing) => {
  return (
    <>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        //   xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></Path>
      </Svg>
    </>
  );
};

export const ProfileIcon = ({ width, height, color }: Sizing) => {
  return (
    <>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        //   xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          opacity="0.4"
          d="M14.4395 19.0498L15.9595 20.5698L18.9995 17.5298"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></Path>
        <Path
          opacity="0.4"
          d="M12.1606 10.87C12.0606 10.86 11.9406 10.86 11.8306 10.87C9.45058 10.79 7.56058 8.84 7.56058 6.44C7.55058 3.99 9.54058 2 11.9906 2C14.4406 2 16.4306 3.99 16.4306 6.44C16.4306 8.84 14.5306 10.79 12.1606 10.87Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></Path>
        <Path
          d="M11.9891 21.8102C10.1691 21.8102 8.35906 21.3502 6.97906 20.4302C4.55906 18.8102 4.55906 16.1702 6.97906 14.5602C9.72906 12.7202 14.2391 12.7202 16.9891 14.5602"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></Path>
      </Svg>
    </>
  );
};

export const FavoriteIcon = ({ width, height, color }: Sizing) => {
  return (
    <>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        //    xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L13.0815 17.1953C12.4227 16.7717 11.5773 16.7717 10.9185 17.1953L5 21Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></Path>
      </Svg>
    </>
  );
};

export const SettingIcon = ({ width, height, color }: Sizing) => {
  return (
    <>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        //   xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          opacity="0.4"
          d="M21.23 7.61998H15.69C15.31 7.61998 15 7.30998 15 6.91998C15 6.53998 15.31 6.22998 15.69 6.22998H21.23C21.61 6.22998 21.92 6.53998 21.92 6.91998C21.92 7.30998 21.61 7.61998 21.23 7.61998Z"
          fill={color}
        ></Path>
        <Path
          opacity="0.4"
          d="M6.46008 7.62023H2.77008C2.39008 7.62023 2.08008 7.31023 2.08008 6.93023C2.08008 6.55023 2.39008 6.24023 2.77008 6.24023H6.46008C6.84008 6.24023 7.15008 6.55023 7.15008 6.93023C7.15008 7.31023 6.84008 7.62023 6.46008 7.62023Z"
          fill={color}
        ></Path>
        <Path
          d="M10.1505 10.84C12.3154 10.84 14.0705 9.08496 14.0705 6.92C14.0705 4.75504 12.3154 3 10.1505 3C7.98551 3 6.23047 4.75504 6.23047 6.92C6.23047 9.08496 7.98551 10.84 10.1505 10.84Z"
          fill={color}
        ></Path>
        <Path
          opacity="0.4"
          d="M21.2296 17.7701H17.5396C17.1596 17.7701 16.8496 17.4601 16.8496 17.0801C16.8496 16.7001 17.1596 16.3901 17.5396 16.3901H21.2296C21.6096 16.3901 21.9196 16.7001 21.9196 17.0801C21.9196 17.4601 21.6096 17.7701 21.2296 17.7701Z"
          fill={color}
        ></Path>
        <Path
          opacity="0.4"
          d="M8.31008 17.7701H2.77008C2.39008 17.7701 2.08008 17.4601 2.08008 17.0801C2.08008 16.7001 2.39008 16.3901 2.77008 16.3901H8.31008C8.69008 16.3901 9.00008 16.7001 9.00008 17.0801C9.00008 17.4601 8.69008 17.7701 8.31008 17.7701Z"
          fill={color}
        ></Path>
        <Path
          d="M13.8497 21.0002C16.0146 21.0002 17.7697 19.2451 17.7697 17.0802C17.7697 14.9152 16.0146 13.1602 13.8497 13.1602C11.6847 13.1602 9.92969 14.9152 9.92969 17.0802C9.92969 19.2451 11.6847 21.0002 13.8497 21.0002Z"
          fill={color}
        ></Path>
      </Svg>
    </>
  );
};

export const OfferIcon = ({ width, height, color }: Sizing) => {
  return (
    <>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        //   xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M8 8H8.01M11.5858 4.58579L19.5858 12.5858C20.3668 13.3668 20.3668 14.6332 19.5858 15.4142L15.4142 19.5858C14.6332 20.3668 13.3668 20.3668 12.5858 19.5858L4.58579 11.5858C4.21071 11.2107 4 10.702 4 10.1716V6C4 4.89543 4.89543 4 6 4H10.1716C10.702 4 11.2107 4.21071 11.5858 4.58579Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></Path>
      </Svg>
    </>
  );
};
