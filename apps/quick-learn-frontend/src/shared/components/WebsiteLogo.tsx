import React, { FC } from 'react';

interface Props {
  color?: string;
  height?: string;
  width?: string;
}

const WebsiteLogo: FC<Props> = (props) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 1382 1045"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="20"
        y="20"
        width="1342"
        height="1005"
        fill="white"
        stroke="#007AFF"
        strokeWidth="40"
      />
      <rect
        x="142.834"
        y="117.232"
        width="1096.33"
        height="811.333"
        fill="#007AFF"
      />
      <path
        d="M652.891 772.28C638.891 772.28 626.058 768.78 614.391 761.78C603.191 755.247 594.091 746.38 587.091 735.18C556.291 750.58 522.224 758.28 484.891 758.28C446.158 758.28 411.391 750.813 380.591 735.88C350.258 720.48 326.458 699.48 309.191 672.88C291.924 645.813 283.291 615.947 283.291 583.28V429.28C283.291 396.613 291.924 367.213 309.191 341.08C326.458 314.48 350.258 293.713 380.591 278.78C411.391 263.38 446.158 255.68 484.891 255.68C524.091 255.68 558.858 263.38 589.191 278.78C619.991 293.713 644.024 314.48 661.291 341.08C678.558 367.213 687.191 396.613 687.191 429.28V583.28C687.191 607.547 682.291 630.413 672.491 651.88C662.691 672.88 648.924 690.847 631.191 705.78C646.591 723.98 667.358 732.147 693.491 730.28C693.491 758.28 679.958 772.28 652.891 772.28ZM593.391 655.38C612.991 637.647 622.791 613.38 622.791 582.58V430.68C622.791 394.747 610.658 366.28 586.391 345.28C562.124 323.813 528.291 313.08 484.891 313.08C441.958 313.08 408.358 323.813 384.091 345.28C359.824 366.28 347.691 394.747 347.691 430.68V562.28C371.491 554.347 393.191 550.38 412.791 550.38C451.524 550.38 485.358 558.547 514.291 574.88C543.224 590.747 569.591 617.58 593.391 655.38ZM484.891 700.88C511.024 700.88 534.124 696.913 554.191 688.98C534.124 655.38 513.124 632.28 491.191 619.68C469.724 607.08 442.658 600.78 409.991 600.78C392.258 600.78 372.658 604.747 351.191 612.68C357.724 640.213 372.424 661.913 395.291 677.78C418.624 693.18 448.491 700.88 484.891 700.88ZM808.138 751.98C798.805 751.98 790.638 748.713 783.638 742.18C777.105 735.18 773.838 727.013 773.838 717.68V310.28C773.838 273.88 795.771 255.68 839.638 255.68V693.88H1054.54C1070.87 693.88 1083.47 699.013 1092.34 709.28C1101.2 719.08 1105.64 733.313 1105.64 751.98H808.138Z"
        fill="white"
      />
    </svg>
  );
};

export default WebsiteLogo;
