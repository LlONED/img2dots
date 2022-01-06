function $(selector, flag) {
    if (flag) {
        return document.querySelectorAll(selector);
    }

    return document.querySelector(selector);
}

const dots = {
    '000000': '⠀',
    '100000': '⠁',
    '001000': '⠂',
    '101000': '⠃',
    '000010': '⠄',
    '100010': '⠅',
    '001010': '⠆',
    '101010': '⠇',
    '010000': '⠈',
    '110000': '⠉',
    '011000': '⠊',
    '111000': '⠋',
    '010010': '⠌',
    '110010': '⠍',
    '011010': '⠎',
    '111010': '⠏',
    '000100': '⠐',
    '100100': '⠑',
    '001100': '⠒',
    '101100': '⠓',
    '000110': '⠔',
    '100110': '⠕',
    '001110': '⠖',
    '101110': '⠗',
    '010100': '⠘',
    '110100': '⠙',
    '011100': '⠚',
    '111100': '⠛',
    '010110': '⠜',
    '110110': '⠝',
    '011110': '⠞',
    '111110': '⠟',
    '000001': '⠠',
    '100001': '⠡',
    '001001': '⠢',
    '101001': '⠣',
    '000011': '⠤',
    '100011': '⠥',
    '001011': '⠦',
    '101011': '⠧',
    '010001': '⠨',
    '110001': '⠩',
    '011001': '⠪',
    '111001': '⠫',
    '010011': '⠬',
    '110011': '⠭',
    '011011': '⠮',
    '111011': '⠯',
    '000101': '⠰',
    '100101': '⠱',
    '001101': '⠲',
    '101101': '⠳',
    '000111': '⠴',
    '100111': '⠵',
    '001111': '⠶',
    '101111': '⠷',
    '010101': '⠸',
    '110101': '⠹',
    '011101': '⠺',
    '111101': '⠻',
    '010111': '⠼',
    '110111': '⠽',
    '011111': '⠾',
    '111111': '⠿'
}

function resolutionAdaptation(width, height) {
    const maxWidth = +$('#maxwidth').value;

    if (width > maxWidth) {
        let i = 2;

        while (width / i > maxWidth) {
            i++
        }

        return {
            width: Math.floor(width / i),
            height: Math.floor(height / i)
        }
    }

    return {
        width,
        height
    }
}

function createDots() {
    const canvas = $("canvas");
    const img = $('#image');

    const resolution = resolutionAdaptation(img.width, img.height)

    canvas.height = resolution.height;
    canvas.width = resolution.width;

    const ctx = canvas.getContext("2d");
    let str = '';

    ctx.drawImage(img, 0, 0, resolution.width, resolution.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let nImgArr = [];

    let j = 0;

    for (i = 0; i < imgData.data.length; i += 4) {
        let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
        let colour = 0;
        if (count > +$('#sensitivity').value) colour = 1;

        if (i / 4 % canvas.width === 0) {
            nImgArr.push([colour]);
            if (i > 0) j++;
            continue;
        }

        nImgArr[j].push(colour);
    }

    for (let y = 0; y < nImgArr.length; y += 3) {
        str += '<span>';

        for (let x = 0; x < nImgArr[y].length; x += 2) {
            let arr = [nImgArr[y][x] || 0, nImgArr[y][x + 1] || 0, nImgArr[y + 1] !== undefined ? (nImgArr[y + 1][x] || 0) : 0, nImgArr[y + 1] !== undefined ? (nImgArr[y + 1][x + 1] || 0) : 0, nImgArr[y + 2] !== undefined ? (nImgArr[y + 2][x] || 0) : 0, nImgArr[y + 2] !== undefined ? (nImgArr[y + 2][x + 1] || 0) : 0];

            str += dots[arr.join('')];
        }
        str += '</span>';
    }

    $('.dots-cnt').innerHTML = str;
};

{
    const input = $('#imageFile');

    input.addEventListener('change', function () {
        const img = $('#image');
        img.src = URL.createObjectURL(this.files[0]);

        img.onload = createDots;
    });
}

{
    const input = $('#sensitivity');

    input.addEventListener('input', function () {
        $('label[for="sensitivity"]').innerHTML = `sensitivity: ${this.value}`;
        if ($('#image').src !== '') createDots();
    });
}

{
    const input = $('#maxwidth');

    input.addEventListener('input', function () {
        $('label[for="maxwidth"]').innerHTML = `maxWidth: ${this.value}`;
        if ($('#image').src !== '') createDots();
    });
}