import ConsoleASCII from '../src';

const button = document.createElement('button');
button.innerText = 'print';
button.onclick = () => {
    ConsoleASCII({
        type: 'text',
        // imageSrc: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fww1.sinaimg.cn%2Fmw690%2F006Twd0Dgy1gyi478eenpj30wi0s6gs0.jpg&refer=http%3A%2F%2Fwww.sina.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1646042459&t=92afd341a0ffa107182bc2e51097bff5',
        // imageSrc: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201709%2F01%2F20170901225540_Pw25T.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1646047315&t=653426d6122ce4cd9b38a1b1e551a26c',
        // imageSrc: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg',
        // imageSrc: 'http://www.degraeve.com/images/lcsm.gif',
        text: '哈哈哈哈哈！',
        fontWeight: 'bolder',
        fontSize: 70
        // scale: .4
    }).then(ca => {
        console.log(ca.toString());
    });
};
document.body.appendChild(button);