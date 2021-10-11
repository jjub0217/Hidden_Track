import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import AOS from 'aos';

import Slider from 'react-slick';
import styled from 'styled-components';
import Footer from '../../Components/Footer';
import 'aos/dist/aos.css';
import './index.scss';
import topArrow from '../../assets/arrow-up.png';

const settings = {
  className: 'center',
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 2000,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '0px',
  // centerMargin: '10px',
  afterChange: function (index) {
    // console.log(
    //   `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
    // );
  }
};

function Landing () {
  const history = useHistory();
  const { accessToken } = useSelector(state => state.accessTokenReducer);
  const scrollRef = useRef();

  const [scrollY, setScrollY] = useState(0);
  const [isScrollToTopBtn, setIsScrollToTopBtn] = useState(false);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    AOS.init();
    requestRecommend(); // Promise

    // 네온사인 svg
    const moveSvg = document.getElementById('move-landing');

    // 네온사인 svg 총 길이
    // const svgTotalLength = moveSvg.getTotalLength();

    // svg attribute(strokeDasharray, strokeDashoffset) 초기설정
    // moveSvg.style.strokeDasharray = svgTotalLength;
    // moveSvg.style.strokeDashoffset = svgTotalLength;

    // 스크롤에 따라 네온사인 따라내려오는 onScroll 이벤트
    // const landingSvgMoving = () => {
    //   window.addEventListener('scroll', () => followScroll(svgTotalLength, moveSvg));
    // };
    // landingSvgMoving();

    //
    const watch = () => {
      window.addEventListener('scroll', setScrollPosition);
    };
    watch();
    return () => setLoading(false);
  }, []);

  useEffect(() => {
    if (scrollY > 570) {
      setIsScrollToTopBtn(true);
    } else {
      setIsScrollToTopBtn(false);
    }
  }, [scrollY]);

  // 추천차트 서버 요청하는 함수
  const requestRecommend = async function () {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/track/charts/all`,
        { headers: { accesstoken: accessToken } });
      setChart(result.data.latestchart);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  // 스크롤에 따라 네온사인 따라내려오는 onScroll 이벤트가 실행되면 호출되는 함수
  function followScroll (svgTotalLength, moveSvg) {
    const scrollPercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);

    const draw = svgTotalLength * scrollPercent;
    moveSvg.style.strokeDashoffset = (svgTotalLength - draw);
  }

  // 메인페이지로 넘어가게 해주는 onClick 이벤트
  function moveMain (e) {
    e.preventDefault();
    history.push('/main');
  }

  // 스크롤 위치를 현재 위치로 set 해주는 scroll 함수
  function setScrollPosition () {
    setScrollY(window.pageYOffset);
  }

  // scrollToTop 버튼 누르면 화면 맨 위로 가게 해주는 onclick 이벤트 함수
  function scrollingBtnTop (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setScrollY(0);
    setIsScrollToTopBtn(false);
  }

  return (
    <>
      <div className='logo sign-one landing-logo'>
        <span className='one-onOff-2'>Welcome to</span><span className='one-onOff'> HIDDEN TRACK</span>
      </div>
      <div className='svg'>
        <svg xmlns='http://www.w3.org/2000/svg' width='1600' viewBox='0 0 13892 32768' fill='none'>
          <path
            d='M1689.75 3.44612C1827.54 356.541 1980.06 671.487 2102.26 1024.52C2141.24 1137.12 2145.08 1353.01 2220.7 1437.03C2353.75 1584.86 2514.45 1672.08 2663.85 1788.28C2993.34 2044.55 3328.65 2256.78 3744.14 2392.76C3932.07 2454.26 4064.7 2468.8 4189.33 2641.9C4323.43 2828.15 4319.97 2889.04 4522.2 2760.34C4612.32 2702.99 4720.3 2671.62 4806.06 2613.31C4899.58 2549.72 4962.54 2445.04 5081.75 2402.97C5153.08 2377.79 5237.42 2621.22 5255.33 2670.49C5279.27 2736.31 5387.64 2980.9 5420.75 2962.51C5556.32 2887.2 5770.41 3062.12 5916.99 3054.41C6039.43 3047.97 6308.98 3043.95 6366.26 2952.3C6411.09 2880.58 6471.38 2821.98 6505.12 2746.05C6541.2 2664.89 6683.23 2676.95 6744.06 2629.64C6825.05 2566.65 6887.09 2735.09 6964.61 2797.1C7092.86 2899.71 7081.23 2855.4 7166.78 2760.34C7305.92 2605.74 7451.95 2418.97 7665.06 2364.17C7867.84 2312.02 8081.61 2311.09 8269.54 2217.13C8438.94 2132.43 8606.42 2256.92 8763.74 2335.58C8959.35 2433.38 9154.12 2552.56 9343.71 2662.32C9417.29 2704.92 9431.71 2751.18 9521.37 2762.38C9741.39 2789.89 9959.56 2846.01 10181 2870.62C10258 2879.18 10371.2 3008.11 10432.2 3050.33C10690.6 3229.25 10799.4 3401.83 10944.7 3679.31C11009.2 3802.43 11107.7 3901.73 11173.5 4028.51C11244.6 4165.74 11282.8 4319.81 11340.9 4463.49C11437.5 4702.28 11456.1 4989.67 11590.1 5208.87C11660.1 5323.5 11651.3 5477.29 11651.3 5609.13C11651.3 5714.47 11763.9 5848.71 11827 5929.75C11830.3 5934.06 11356 6119.17 11300.1 6133.96C11040.7 6202.62 10865.6 6068.62 10605.8 6068.62C10563 6068.62 10481.4 6005.37 10475.1 6068.62C10462.3 6195.84 10414.7 6308.72 10323.9 6399.44C10081.3 6642.03 9923.67 6728.25 9923.67 7097.86C9923.67 7300.18 9840.99 7252.44 9678.62 7244.89C9298.02 7227.19 8906.6 7130.16 8569.73 6952.86C8481.17 6906.25 8195.59 6756.34 8161.3 6636.33C8124.98 6509.2 8131.27 6383.22 8010.19 6564.86C7939.07 6671.53 7796.83 6696.23 7695.69 6750.69C7348.54 6937.62 6915.23 6943.55 6529.63 6950.82C6174.94 6957.51 5741.67 6899.9 5394.2 6995.75C5265.89 7031.14 5065.56 7158.89 4995.98 7263.27C4934.49 7355.51 4755.36 7547.9 4650.86 7577.76C4605.01 7590.86 4549.51 7746.83 4511.99 7788.1C4417.89 7891.62 4097.58 7793 3985.12 7751.34C3836.04 7696.13 3624.02 7624.49 3499.09 7530.79C3311.76 7390.3 3333.9 7414.21 3102.91 7473.61C2946.35 7513.87 2796.2 7647.59 2645.47 7714.58C2567.47 7749.25 2490.3 7694.34 2414.71 7688.04C2267.41 7675.76 2115.5 7685.99 1967.48 7685.99C1772.16 7685.99 1571.04 7615.68 1375.26 7651.28C1219.48 7679.6 1047.77 7716.88 889.226 7722.75C722.732 7728.92 770.782 7833.13 770.782 7980.06C770.782 8102.01 789.732 8209.06 807.541 8329.27C814.908 8379 815.896 8483.05 852.468 8523.27C870.177 8542.75 906.556 8519.6 915.774 8551.86C972.072 8748.91 530.274 9026.11 719.728 9215.56C778.748 9274.58 878.575 9368.84 909.648 9450.41C943.819 9540.11 877.212 9858.2 823.878 9934.4C734.721 10061.8 762.451 10075.3 599.242 10075.3C449.24 10075.3 419.514 10081 311.299 10165.2C248.033 10214.4 203.564 10172.6 243.909 10255C300.431 10370.4 351.963 10476.8 321.51 10606.3C297.887 10706.7 263.267 10833.7 201.024 10916.7C144.718 10991.7 19.7936 11089.4 2.93556 11182.1C-1.49851 11206.5 342.536 11237.4 386.859 11257.7C494.037 11306.7 570.162 11384 660.506 11451.7C691.747 11475.1 739.283 11398.6 770.782 11398.6C840.253 11398.6 807.541 11613.6 807.541 11655.9C807.541 11750.3 753.898 12112.9 836.131 12178.7C874.093 12209.1 996.431 12145.5 1044.43 12131.7C1130.73 12107.1 1169.54 12118.1 1264.98 12142C1548.75 12212.9 1840.37 12201.2 2120.64 12264.5C2532.82 12357.6 2995.04 12165.7 3180.51 12623.9C3248.98 12793 3421.1 12620.8 3515.42 12530C3588.47 12459.6 3632.57 12402.6 3695.13 12483C3741.64 12542.8 3789.82 12619.7 3856.46 12519.8C4044.47 12237.7 4049.6 12595.3 4105.6 12556.5C4322.73 12406.2 4721.92 12383.9 4969.43 12436C5185.81 12481.6 5404.02 12510.2 5622.92 12554.5C5885.94 12607.7 5937.52 12543.1 5916.99 12758.7C5897.15 12967 5831.99 13026.6 5998.67 13154.9C6280.16 13371.4 6454.19 13155.2 6668.5 12946.6C6745.3 12871.8 6830.12 12758.7 6891.09 12907.8C6919.9 12978.2 6982.99 13067 6982.99 13144.6C6982.99 13318.7 7100.47 13214.3 7205.58 13181.4C7335.11 13140.9 7470.2 13083.2 7603.8 13060.9C7718.62 13041.8 7844.54 13062.9 7938.71 12979.2C7969.73 12951.7 8160.81 12825.7 8187.85 12869C8265.1 12992.6 8331.1 13151.6 8379.81 13285.6C8401.83 13346.1 8498.61 13292.7 8535.02 13281.5C8675.27 13238.3 8625.76 13384.2 8639.17 13471.4C8650.37 13544.2 8673.88 13598 8673.88 13677.6C8673.88 13810.7 8881.5 13751.2 8978.16 13751.2C9078.85 13751.2 9214.59 13719.2 9311.03 13730.7C9357.54 13736.3 9335.54 13928.2 9335.54 13971.7C9335.54 14300.8 9711.03 14210.4 9964.52 14184.1C10097.9 14170.2 10177.3 14141.1 10291.3 14100.4C10452.5 14042.8 10366.9 14281 10483.2 14302.5C10748.2 14351.6 11039.1 14387.2 11308.2 14408.7C11426.1 14418.2 11997.4 14368 12055.7 14470C12282.7 14867.2 12695.6 15084 13029.8 15372.6C13293.6 15600.5 13517.3 15927.2 13701.6 16214C13720 16242.5 13734.2 16185 13730.2 16173.1C13691.1 16055.8 13659.8 16410.8 13638.3 16532.6C13584.1 16840.1 13321.2 16943.2 13084.9 17137C12954.8 17243.8 12970.6 17232.6 13082.9 17286.1C13257.7 17369.4 13410.7 17500.8 13591.4 17565.9C13665.9 17592.7 13620.8 17588.3 13673.1 17523C13693.7 17497.2 13723.8 17586.2 13726.1 17592.4C13756.1 17673.6 13729.7 17719.1 13685.3 17790.5C13613.8 17905.6 13379 18095.6 13379 18235.7C13379 18398.7 13632.3 18744.6 13524 18825.9C13344.7 18960.3 13134 19060 12933.8 19158.8C12817.3 19216.2 12720 19229.1 12635.6 19330.3C12571.1 19407.7 12523.3 19498.3 12460 19577.4C12417.9 19630.1 12119.6 19373.3 12063.8 19338.5C11933.6 19257 11867.2 19762 11849.4 19851.1C11819.1 20002.9 11792 20165.2 11720.8 20304.4C11711.7 20322 11559.9 20546.1 11541.1 20514.7C11515.8 20472.6 11239.8 20413.6 11183.7 20410.6C11039 20402.8 10896.1 20436.1 10750.7 20418.8C10696.9 20412.4 10614.1 20341.5 10564.9 20347.3C10521.2 20352.4 10545.1 20619.2 10466.9 20653.6C10155.6 20790.6 10033.3 20185.3 9715.38 20420.8C9623.12 20489.2 9239.2 20840.2 9184.42 20716.9C9146.22 20631 8703.39 20353.9 8614.66 20429C8304.55 20691.4 7989.33 20808.8 7589.5 20808.8C7483.93 20808.8 7422.74 20827.9 7350.57 20755.7C7305.84 20711 7140.1 20596.1 7076.93 20612.8C6861.4 20669.5 6715.28 20880.2 6496.96 20941.6C6230.03 21016.6 5943.79 21077.3 5696.44 21205C5589.85 21260 5511.17 21358.9 5402.37 21413.3C5291.31 21468.8 4996.3 21158.8 4922.46 21096.8C4906.94 21083.7 4797.02 20971.9 4789.72 20972.2C4640.25 20977.5 4321.22 21134.8 4209.75 21235.6C4097.01 21337.6 4056.67 21409.7 3915.69 21441.9C3691.06 21493.2 3435.64 21518.3 3219.31 21584.8C3064.13 21632.6 2964.23 21886.9 2776.17 21829.9C2390.71 21713.1 1925.7 21557.4 1520.25 21617.5C1379.19 21638.4 1238.11 21714.8 1101.61 21727.8C1050.97 21732.6 982.607 21656.1 954.575 21723.7C873.23 21919.9 917.816 22191 917.816 22401.7C917.816 22499.7 826.223 22521.5 762.613 22581.4C681.829 22657.4 349.875 23059.2 227.571 23028.6C225.134 23028 256.162 22986.7 256.162 23010.3C256.162 23094 228.077 23174.4 221.445 23257.3C205.909 23451.5 282.18 23636.8 276.583 23827.1C275.315 23870.2 65.6008 23944.2 25.3992 23984.4C14.2172 23995.5 90.7755 24092.2 100.959 24125.3C126.065 24206.9 109.127 24319.2 109.127 24403C109.127 24446.8 130.304 24563.3 90.7478 24595C54.6111 24623.9 22.0042 24656.2 43.7785 24705.2C121.284 24879.6 256.162 25030.3 256.162 25228C256.162 25342.3 202.054 25589 262.288 25679.3C317.812 25762.6 580.86 25777.3 586.989 25881.5C591.7 25961.6 576.74 26051 640.085 26114.3C671.276 26145.5 815.659 26150.4 856.552 26159.2C1069.83 26205.5 1282.04 26252.7 1493.7 26306.3C1629.69 26340.7 2234.69 26405.4 2286.05 26559.5C2320.37 26662.5 2366.62 26746.3 2441.26 26820.9C2493.66 26873.3 2508.34 26993.2 2563.79 26845.4C2619.77 26696.1 2688.17 26459.3 2780.25 26702.4C2822.44 26813.8 2811.02 26961.7 2923.2 26890.3C3045.14 26812.7 3798.9 26545.7 3887.1 26677.9C3987.47 26828.5 3887.12 27089.5 3934.06 27253.8C3935 27257.1 4112.21 27205.4 4115.82 27204.8C4266.05 27179.8 4424.82 27176.3 4571.21 27131.3C4678.58 27098.3 4760.35 26986.2 4838.73 26914.8C4873.37 26883.3 5053.13 26661.8 5116.47 26731C5199.99 26822.4 5254.1 26988 5326.81 27092.5C5542.61 27402.7 5392.46 27916.6 5439.13 28287.2C5449.09 28366.3 5439.63 28530.3 5545.32 28438.3C5689.65 28312.6 5837.29 28192.6 5968.04 28052.3C6202.48 27800.7 6407.51 27513.7 6586.81 27221.2C6629.86 27150.9 6752.18 27468.5 6780.81 27515.2C6848.48 27625.6 6856.19 27705.6 6982.99 27645.9C7117.63 27582.6 7315.13 27547.8 7460.85 27535.6C7580.01 27525.7 7650.44 27660.3 7730.41 27729.6C7753.81 27749.9 7778.84 27761.1 7810.06 27754.2C8057.88 27699.1 8321.66 27542.3 8555.44 27445.8C8632.66 27413.9 8896.46 27211.4 8935.28 27337.6C8951.9 27391.6 9045.12 27604.7 9096.61 27570.4C9224.87 27484.9 9149.92 27436.1 9298.78 27629.6C9352.91 27699.9 9565.21 28029.9 9647.99 28011.5C9801.68 27977.3 9938.19 27616.3 9968.6 27474.4C9999.04 27332.3 9963.37 27295.3 10105.4 27313C10282.4 27335.2 10457.3 27401 10630.3 27445.8C11133.7 27576.1 11668.9 27577.4 12165.9 27719.4C12287.3 27754.1 12404.9 27781.2 12529.5 27795C12644.6 27807.8 12789.7 27885.8 12905.2 27919.6C13083.7 27971.7 13285.6 28035.9 13450.5 28125.8C13564.5 28188 13561 28247 13599.5 28364.8C13687.5 28633.2 13759.7 28793.9 13673.1 29059.1C13552.9 29426.6 13515.2 29714.2 13611.8 30100.6C13689.8 30412.8 13907.1 30767.6 13887.5 31091C13861.4 31520.7 13704.8 31827.3 13393.3 32079.4C13035.3 32369.2 12769.7 32711.4 12272.1 32755.4C12027.8 32777 12153.5 32755.4 12276.2 32755.4'
            stroke='#FEE2FF' stroke-width='70' stroke-linecap='round'
          />
          {/* </svg> */}

          {/* <svg xmlns='http://www.w3.org/2000/svg' width='1600' viewBox='0 0 3321 11949' fill='none'>

          <filter id='glow' x='-5000%' y='-5000%' width='10000%' height='10000%'>
            <feFlood result='flood' floodColor='#FBB4FF' floodOpacity='.9' />
            <feComposite in='flood' result='mask' in2='SourceGraphic' operator='in' />
            <feMorphology in='mask' result='dilated' operator='dilate' radius='15' />
            <feGaussianBlur in='dilated' result='blurred' stdDeviation='20' />
            <feMerge>
              <feMergeNode in='blurred' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>

          <path
            d='M11 11C33.9958 169.421 66.3444 333.098 66.3444 494.568C66.3444 537.079 50.3604 644.247 88.8921 655.757C209.31 691.727 321.284 764.107 440.431 801.791C605.648 854.047 790.426 829.345 960.054 829.345C1040.55 829.345 1015.94 856.427 1052.29 934.049C1066.3 963.959 1115.25 1022.42 1117.89 1052.53C1131.08 1203.23 1262.4 983.987 1298.27 934.049C1326.92 894.158 1366.11 794.631 1404.86 771.482C1421.87 761.319 1516.79 861.479 1531.95 878.942C1562.79 914.48 1710.73 1124.49 1745.12 1126.93C1809.01 1131.45 1873.82 1126.93 1937.8 1126.93C1957.15 1126.93 1995.27 1109.24 1993.15 1115.9C1958.23 1225.44 2042.32 1318.11 2114.09 1311.54C2203.03 1303.38 2290.36 1300.51 2379.53 1300.51C2423.87 1300.51 2561.48 1265.31 2592.71 1314.29C2646.37 1398.43 2643.82 1523.47 2694.18 1610.49C2722.78 1659.92 2713.06 1756.17 2750.55 1796.48C2780.46 1828.65 2814.54 1914.42 2841.76 1957.67C2860.36 1987.22 2919.52 2017.09 2899.16 2044.46C2855.97 2102.51 2771.24 2157.57 2718.77 2204.27C2702.67 2218.61 2585.22 2354.49 2556.84 2336.53C2505.83 2304.26 2445.22 2244.33 2392.86 2204.27C2281.76 2119.3 2283.15 2432.99 2280.12 2534.92C2276.11 2669.51 1813.77 2399.12 1800.47 2738.82C1796.17 2848.71 1281.49 2788.41 1259.32 2788.41C1249.92 2788.41 906.681 2740.83 897.535 2814.59C887.224 2897.75 914.958 2988.66 914.958 3073.59C914.958 3131.01 919.359 3115.86 860.639 3135.59C762.798 3168.47 671.178 3218.89 570.593 3237.54C314.756 3284.97 647.617 3479.59 591.091 3631.56C570.403 3687.18 557.313 3736.57 550.095 3799.63C543.718 3855.36 667.027 3807.13 693.581 3805.15C756.59 3800.44 837.622 3744.06 896.51 3711.46C897.7 3710.8 1060.63 3912.13 1083.04 3931.89C1211.58 4045.22 1219.43 4086.87 1367.96 4066.91C1524.13 4045.91 1680.53 4024.97 1835.31 3989.76C1926.57 3969 2074.21 3900.35 2165.33 3934.65C2212.4 3952.36 2275.94 4123.03 2321.12 4171.61C2348.64 4201.21 2513.27 4151.79 2550.69 4152.32C2649.8 4153.72 2745.82 4177.12 2844.84 4177.12C2868.29 4177.12 2960.17 4156.74 2977.05 4188.14C2992.42 4216.75 2990.57 4257.35 3008.82 4287.34C3047.62 4351.09 3101.26 4499.5 3166.65 4499.5C3213.16 4499.5 3345.63 4533.3 3300.92 4550.47C3174.61 4598.98 3042.76 4598.93 2918.63 4673.09C2856.63 4710.13 2946.4 5104.05 2850.99 5007.86C2791.21 4947.6 2663.41 4805.35 2587.59 4805.35C2555.91 4805.35 2494.01 4933.11 2473.82 4969.29C2403.16 5095.94 2237.65 5081.25 2133.56 5105.68C2010.76 5134.5 1889.42 5178.06 1766.65 5209.01C1568.46 5258.96 1354.69 5298.95 1152.73 5316.47C1039.03 5326.33 1037.72 5139.92 961.078 5071.24C905.694 5021.61 917.455 5041.71 868.838 5107.06C808.49 5188.18 740.376 5257.7 680.257 5338.51C633.148 5401.83 552.189 5529.78 486.552 5560.32C425.197 5588.87 67.3885 5614.61 92.9917 5670.53C184.194 5869.75 451.88 6070.15 302.07 6329.06C295.429 6340.54 372.658 6335.68 390.211 6333.2C518.863 6314.99 596.157 6254.44 719.203 6333.2C777.812 6370.71 804.306 6382.49 871.913 6356.62C1023.55 6298.59 1177.63 6236.62 1324.92 6160.99C1351.03 6147.58 1467.94 6046.08 1495.05 6092.1C1514.97 6125.93 1542.05 6149.09 1568.84 6172.01C1672.51 6260.69 1854.98 6182.23 1962.4 6173.39C2084.66 6163.33 2273.26 6195.39 2382.61 6111.39C2396.62 6100.63 2458.61 6027.4 2463.58 6050.77C2479.07 6123.66 2496.98 6191.97 2518.92 6265.69C2529.07 6299.8 2828.03 6381.55 2792.57 6453.06C2715.73 6607.99 2575.29 6455.91 2575.29 6690.02C2575.29 6782.5 2596.31 6885.96 2505.6 6849.83C2477.92 6838.81 2378.08 6799.88 2358.01 6841.56C2323.76 6912.72 2378.22 6923.26 2345.71 6814.01C2282.49 6601.53 2000.55 6675.21 1866.06 6701.04C1787.65 6716.1 1778.41 6938.35 1754.35 7028.93C1743.54 7069.6 1746.35 7186.89 1714.38 7202.52C1618.51 7249.38 1457.47 7208.85 1359.76 7187.36C1192.92 7150.66 947.601 7053.62 776.597 7104.7C608.884 7154.8 565.86 7183.47 502.95 7406.41C485.35 7468.79 473.103 7514.61 449.655 7574.49C415.644 7661.36 555.413 7701.01 589.041 7761.86C617.188 7812.79 559.737 7878.5 541.896 7921.67C505.316 8010.18 598.009 7967.82 654.635 7976.78C758.643 7993.22 755.758 8004.33 826.817 8075.97C904.952 8154.74 1068.04 8030.35 1140.44 7971.27C1193.44 7928.01 1255.25 7943.9 1304.42 7990.55C1335.65 8020.19 1369.81 8141.64 1388.46 8103.52C1414.9 8049.51 1423.83 7984.04 1478.65 7997.44C1557.39 8016.68 1645.05 8109.76 1714.38 8155.88C1780.01 8199.54 1941.75 8352.36 2022.87 8303.29C2140.66 8232.04 2208.23 8132.59 2318.04 8268.85C2370.19 8333.56 2429.77 8393.26 2489.2 8445.19C2538.59 8488.34 2626.51 8512.42 2661.38 8578.83C2679.87 8614.04 2673.4 8720.02 2647.03 8751.04C2590.74 8817.25 2407.65 8753.97 2338.54 8756.55C2261.13 8759.44 2239.21 8899.67 2199.15 8970.09C2097.35 9149.03 1992.15 9047.66 1845.56 9092.7C1772.34 9115.2 1701.05 9118.09 1625.21 9125.77C1583.19 9130.02 1450.33 9117.74 1413.06 9172.61C1328.35 9297.31 1381.46 9427.34 1236.78 9434.37C1053.3 9443.28 870.088 9435.75 718.178 9577.65C634.235 9656.06 539.842 9714.46 456.83 9792.57C446.054 9802.71 425.659 9805.32 420.958 9822.88C405.91 9879.07 411.683 9948.02 394.311 10004.7C381.22 10047.5 521.42 10112.6 554.195 10134.2C707.947 10235.5 877.463 10096.3 1040 10084.6C1122.35 10078.7 1268.25 10050 1322.87 10154.9C1343.4 10194.3 1366.24 10263.2 1404.86 10272C1584.91 10312.9 1775.34 10315.8 1957.28 10336.8C1989.16 10340.4 2101 10322.1 2118.19 10382.2C2136.17 10445.1 2155.58 10515.8 2177.63 10575.1C2194.09 10619.3 2338.42 10688.5 2356.99 10700.5C2440.7 10754.4 2530.74 10802.1 2608.09 10872.7C2649.21 10910.2 2691.56 10930 2724.92 10980.1C2816.76 11118.2 2904.74 11238.2 2921.7 11432C2936.54 11601.6 2922.97 11771.1 2907.36 11939'
            stroke='#FEE2FF' strokeWidth='30' strokeLinecap='round'
          />

          <path
            id='move-landing' d='M11 11C33.9958 169.421 66.3444 333.098 66.3444 494.568C66.3444 537.079 50.3604 644.247 88.8921 655.757C209.31 691.727 321.284 764.107 440.431 801.791C605.648 854.047 790.426 829.345 960.054 829.345C1040.55 829.345 1015.94 856.427 1052.29 934.049C1066.3 963.959 1115.25 1022.42 1117.89 1052.53C1131.08 1203.23 1262.4 983.987 1298.27 934.049C1326.92 894.158 1366.11 794.631 1404.86 771.482C1421.87 761.319 1516.79 861.479 1531.95 878.942C1562.79 914.48 1710.73 1124.49 1745.12 1126.93C1809.01 1131.45 1873.82 1126.93 1937.8 1126.93C1957.15 1126.93 1995.27 1109.24 1993.15 1115.9C1958.23 1225.44 2042.32 1318.11 2114.09 1311.54C2203.03 1303.38 2290.36 1300.51 2379.53 1300.51C2423.87 1300.51 2561.48 1265.31 2592.71 1314.29C2646.37 1398.43 2643.82 1523.47 2694.18 1610.49C2722.78 1659.92 2713.06 1756.17 2750.55 1796.48C2780.46 1828.65 2814.54 1914.42 2841.76 1957.67C2860.36 1987.22 2919.52 2017.09 2899.16 2044.46C2855.97 2102.51 2771.24 2157.57 2718.77 2204.27C2702.67 2218.61 2585.22 2354.49 2556.84 2336.53C2505.83 2304.26 2445.22 2244.33 2392.86 2204.27C2281.76 2119.3 2283.15 2432.99 2280.12 2534.92C2276.11 2669.51 1813.77 2399.12 1800.47 2738.82C1796.17 2848.71 1281.49 2788.41 1259.32 2788.41C1249.92 2788.41 906.681 2740.83 897.535 2814.59C887.224 2897.75 914.958 2988.66 914.958 3073.59C914.958 3131.01 919.359 3115.86 860.639 3135.59C762.798 3168.47 671.178 3218.89 570.593 3237.54C314.756 3284.97 647.617 3479.59 591.091 3631.56C570.403 3687.18 557.313 3736.57 550.095 3799.63C543.718 3855.36 667.027 3807.13 693.581 3805.15C756.59 3800.44 837.622 3744.06 896.51 3711.46C897.7 3710.8 1060.63 3912.13 1083.04 3931.89C1211.58 4045.22 1219.43 4086.87 1367.96 4066.91C1524.13 4045.91 1680.53 4024.97 1835.31 3989.76C1926.57 3969 2074.21 3900.35 2165.33 3934.65C2212.4 3952.36 2275.94 4123.03 2321.12 4171.61C2348.64 4201.21 2513.27 4151.79 2550.69 4152.32C2649.8 4153.72 2745.82 4177.12 2844.84 4177.12C2868.29 4177.12 2960.17 4156.74 2977.05 4188.14C2992.42 4216.75 2990.57 4257.35 3008.82 4287.34C3047.62 4351.09 3101.26 4499.5 3166.65 4499.5C3213.16 4499.5 3345.63 4533.3 3300.92 4550.47C3174.61 4598.98 3042.76 4598.93 2918.63 4673.09C2856.63 4710.13 2946.4 5104.05 2850.99 5007.86C2791.21 4947.6 2663.41 4805.35 2587.59 4805.35C2555.91 4805.35 2494.01 4933.11 2473.82 4969.29C2403.16 5095.94 2237.65 5081.25 2133.56 5105.68C2010.76 5134.5 1889.42 5178.06 1766.65 5209.01C1568.46 5258.96 1354.69 5298.95 1152.73 5316.47C1039.03 5326.33 1037.72 5139.92 961.078 5071.24C905.694 5021.61 917.455 5041.71 868.838 5107.06C808.49 5188.18 740.376 5257.7 680.257 5338.51C633.148 5401.83 552.189 5529.78 486.552 5560.32C425.197 5588.87 67.3885 5614.61 92.9917 5670.53C184.194 5869.75 451.88 6070.15 302.07 6329.06C295.429 6340.54 372.658 6335.68 390.211 6333.2C518.863 6314.99 596.157 6254.44 719.203 6333.2C777.812 6370.71 804.306 6382.49 871.913 6356.62C1023.55 6298.59 1177.63 6236.62 1324.92 6160.99C1351.03 6147.58 1467.94 6046.08 1495.05 6092.1C1514.97 6125.93 1542.05 6149.09 1568.84 6172.01C1672.51 6260.69 1854.98 6182.23 1962.4 6173.39C2084.66 6163.33 2273.26 6195.39 2382.61 6111.39C2396.62 6100.63 2458.61 6027.4 2463.58 6050.77C2479.07 6123.66 2496.98 6191.97 2518.92 6265.69C2529.07 6299.8 2828.03 6381.55 2792.57 6453.06C2715.73 6607.99 2575.29 6455.91 2575.29 6690.02C2575.29 6782.5 2596.31 6885.96 2505.6 6849.83C2477.92 6838.81 2378.08 6799.88 2358.01 6841.56C2323.76 6912.72 2378.22 6923.26 2345.71 6814.01C2282.49 6601.53 2000.55 6675.21 1866.06 6701.04C1787.65 6716.1 1778.41 6938.35 1754.35 7028.93C1743.54 7069.6 1746.35 7186.89 1714.38 7202.52C1618.51 7249.38 1457.47 7208.85 1359.76 7187.36C1192.92 7150.66 947.601 7053.62 776.597 7104.7C608.884 7154.8 565.86 7183.47 502.95 7406.41C485.35 7468.79 473.103 7514.61 449.655 7574.49C415.644 7661.36 555.413 7701.01 589.041 7761.86C617.188 7812.79 559.737 7878.5 541.896 7921.67C505.316 8010.18 598.009 7967.82 654.635 7976.78C758.643 7993.22 755.758 8004.33 826.817 8075.97C904.952 8154.74 1068.04 8030.35 1140.44 7971.27C1193.44 7928.01 1255.25 7943.9 1304.42 7990.55C1335.65 8020.19 1369.81 8141.64 1388.46 8103.52C1414.9 8049.51 1423.83 7984.04 1478.65 7997.44C1557.39 8016.68 1645.05 8109.76 1714.38 8155.88C1780.01 8199.54 1941.75 8352.36 2022.87 8303.29C2140.66 8232.04 2208.23 8132.59 2318.04 8268.85C2370.19 8333.56 2429.77 8393.26 2489.2 8445.19C2538.59 8488.34 2626.51 8512.42 2661.38 8578.83C2679.87 8614.04 2673.4 8720.02 2647.03 8751.04C2590.74 8817.25 2407.65 8753.97 2338.54 8756.55C2261.13 8759.44 2239.21 8899.67 2199.15 8970.09C2097.35 9149.03 1992.15 9047.66 1845.56 9092.7C1772.34 9115.2 1701.05 9118.09 1625.21 9125.77C1583.19 9130.02 1450.33 9117.74 1413.06 9172.61C1328.35 9297.31 1381.46 9427.34 1236.78 9434.37C1053.3 9443.28 870.088 9435.75 718.178 9577.65C634.235 9656.06 539.842 9714.46 456.83 9792.57C446.054 9802.71 425.659 9805.32 420.958 9822.88C405.91 9879.07 411.683 9948.02 394.311 10004.7C381.22 10047.5 521.42 10112.6 554.195 10134.2C707.947 10235.5 877.463 10096.3 1040 10084.6C1122.35 10078.7 1268.25 10050 1322.87 10154.9C1343.4 10194.3 1366.24 10263.2 1404.86 10272C1584.91 10312.9 1775.34 10315.8 1957.28 10336.8C1989.16 10340.4 2101 10322.1 2118.19 10382.2C2136.17 10445.1 2155.58 10515.8 2177.63 10575.1C2194.09 10619.3 2338.42 10688.5 2356.99 10700.5C2440.7 10754.4 2530.74 10802.1 2608.09 10872.7C2649.21 10910.2 2691.56 10930 2724.92 10980.1C2816.76 11118.2 2904.74 11238.2 2921.7 11432C2936.54 11601.6 2922.97 11771.1 2907.36 11939'
            strokeWidth='30' strokeLinecap='round'
            stroke='#f16ffa'
            style={{ filter: 'url(#glow)' }}
            opacity='.7'
          /> */}
        </svg>
      </div>

      <div className='container__landing'>

        <section id='section1'>
          <figure className='landing__figure' role='img' aria-labelledby='landing-caption'>
            <figcaption id='landing__section1_figcaption'>
              <pre className='landing__pre1'>{`판에 박힌 음악차트. 
어디서든 똑같은 음원 순위... 
지겨우셨나요?`}
              </pre>
              <pre className='landing__pre2'>{`HIDDEN TRACK에서 
신선한 음악, 색다른 아티스트들의 다양한 음악을 즐겨보세요!`}
              </pre>
              <button onClick={(e) => moveMain(e)}>enjoy right now</button>
            </figcaption>
            <div className='landing__section1_img' />
          </figure>
        </section>

        <section
          id='section2'
          data-aos='fade-up'
          data-aos-duration='500'
          data-aos-delay='30'
          data-aos-easing='linear'
          data-aos-anchor-placement='bottom-bottom'
        >
          <figure className='landing__figure' role='img' aria-labelledby='landing-caption'>
            <div className='landing__section2-img' />
            <figcaption id='landing__section2-figcaption'>
              <pre className='landing__pre1'>신선한 음악, 색다른 아티스트.
              </pre>
              <pre className='landing__pre2'>{`HIDDEN TRACK에서는 
신인 가수, 아직 알려지지 않은 가수들이 직접 등록한 색다른 음악을 감상하실 수 있습니다.`}
              </pre>
              <pre className='landing__pre3'>* 아티스트분들은 자신의 음악을 업로드 할 수 있습니다.
              </pre>
            </figcaption>
          </figure>
        </section>

        <section id='section3'>
          <figure className='landing__section3-figure' role='img' aria-labelledby='landing-caption'>
            <figcaption id='landing__figcaption'>
              <pre className='landing__pre1'>당신을 위한 음악 추천!
              </pre>
            </figcaption>
            <LandingSlider {...settings}>
              {chart.map((slide, i) => {
                const { img, id } = slide;
                return (
                  <div className='section3-slide-img' key={id}>
                    <ImgSlide img={img} />
                  </div>
                );
              })}
            </LandingSlider>
            <pre className='landing__pre2'>{`HIDDEN TRACK에서 추천하는 음악을 들어보세요!
인기곡 최신곡과 더불어, 이용패턴을 분석해 내 취향에 꼭 맞는 음악을 추천해드립니다.`}
            </pre>
          </figure>
        </section>

        <section
          id='section4'
          data-aos='fade-right'
          data-aos-duration='500'
          data-aos-delay='30'
        >
          <figure className='landing__figure' role='img' aria-labelledby='landing-caption'>
            <div className='landing__section4-img' />
            <figcaption id='landing__figcaption'>
              <pre className='landing__pre1'>원하는 음악을 더 쉽게 찾아보세요!
              </pre>
              <pre className='landing__pre2'>{`HIDDEN TRACK은 검색시, 
음원, 아티스트, 해시태그로 구성된 3가지 검색 결과를 제공합니다.`}
              </pre>
            </figcaption>
          </figure>
        </section>

        <section
          id='section5'
          data-aos='fade-left'
          data-aos-duration='500'
          data-aos-delay='30'
        >
          <figure className='landing__figure' role='img' aria-labelledby='landing-caption'>
            {/* <img className="landing__section1-img" src='../../assets/landing1.png' alt="" /> */}
            <div className='landing__section5-img' />
            <figcaption id='landing__figcaption'>
              <pre className='landing__pre1'>자유롭게 음악을 감상하세요!
              </pre>
              <pre className='landing__pre2'>{`side bar에 있는 music player를 통해 나만의 play list 구성하고 음악을 감상하세요!  
음악 재생중엔 편하게 HIDDEN TRACK 을 이용하실 수 있습니다.`}
              </pre>
              <pre className='landing__pre3'>* HIDDEN TRACK은 visualizer(음원 시각화)기능을 추가로 제공합니다.
              </pre>
            </figcaption>
          </figure>
        </section>
        {isScrollToTopBtn && <img ref={scrollRef} onClick={(e) => scrollingBtnTop(e)} className='scrollTop' src={topArrow} alt='top-arrow' />}
      </div>

      <Footer />
    </>
  );
}

export default Landing;

export const LandingSlider = styled(Slider)`
/* background-color: greenyellow; */
 `;

export const ImgSlide = styled.div`
  width: 300px;
  height: 300px;
  background-image: url(${props => props.img});
  background-size: cover;
  background-position: center;
  /* margin: 0 30px; */
`;
