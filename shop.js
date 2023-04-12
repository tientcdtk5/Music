// Danh sách sản phẩm
let products = [
  {
    id: 1,
    name: "Áo kiểu nữ cam đất phối cổ trắng dập ly",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, velit.",
    price: 250000,
    image:
      "https://image.yes24.vn/Upload/ProductImage/anhduong201605/1947415_L.jpg?width=550&height=550",
    count: 1,
  },
  {
    id: 2,
    name: "Áo trắng bèo lé đen tay loe dễ thương",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, velit.",
    price: 350000,
    image:
      "https://image.yes24.vn/Upload/ProductImage/anhduong201605/1914666_L.jpg?width=550&height=550",
    count: 1,
  },
];

let promotionCode = {
  A: 10,
  B: 20,
  C: 30,
  D: 40,
};

let currentCode;

$.each(products, function (index, product) {
  const $product = $(`
  <li class="row">
    <div class="col left">
      <div class="thumbnail">
        <a href="#">
          <img src="https://via.placeholder.com/200x150" alt="${
            product.name
          }" />
        </a>
      </div>
      <div class="detail">
        <div class="name"><a href="#">${product.name}</a></div>
        <div class="description">
          ${product.description}
        </div>
        <div class="price">${product.price.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        })}</div>
      </div>
    </div>

    <div class="col right">
      <div class="quantity">
        <input type="number" class="quantity" step="1" value="${
          product.count
        }" />
      </div>

      <div class="remove">
        <span class="close"
          ><i class="fa fa-times" aria-hidden="true"></i
        ></span>
      </div>
    </div>
  </li>
  `);

  const $quantity = $("input.quantity", $product);
  const $remove = $(".remove", $product);

  $quantity.on("input", { $el: $quantity, product }, updateItem);
  $remove.on("click", { $el: $product, productId: product.id }, deleteItem);

  $product.appendTo($(".products"));
});

// - Cập nhật số lượng sản phẩm hiện có trong giỏ hàng
function updateTotalItem() {
  const total = products.reduce(function (total, product) {
    return (total += product.count);
  }, 0);

  $(".count .value").text(total);
}

const $callback = $.Callbacks();

$callback.add(updateTotalItem);
$callback.add(updateTotalPrice);

// - Xóa sản phẩm khỏi giỏ hàng
function deleteItem(e) {
  const $el = e.data.$el;
  const productId = e.data.productId;

  $el.remove();

  const idx = products.findIndex(function (product) {
    return product.id === productId;
  });

  products.splice(idx, 1);
  if (products.length === 0) {
    const hide = document.getElementById("container_big");
    hide.style.display = "none";
    const zero = document.createElement("p");
    zero.id = "zero";
    zero.textContent = "Giỏ hàng trống";
    zero.style.fontSize = "24px";
    zero.style.color = "red";
    zero.style.textAlign = "center";
    zero.style.fontWeight = "800";
    const main = document.getElementById("main");
    main.append(zero);
  }
  $callback.fire();
}
// - Thay đổi số lượng sản phẩm
function updateItem(e) {
  const $quantity = e.data.$el;
  const count = Number($quantity.val());
  const product = e.data.product;

  if (count > 0) {
    product.count = count;
  } else {
    product.count = 1;
    $quantity.val(1);
  }

  $callback.fire();
}

function calcSubTotal() {
  const total = products.reduce(function (total, product) {
    return (total += product.count * product.price);
  }, 0);

  return total;
}

// - Cập nhật tổng tiền
function updateTotalPrice() {
  const subTotal = calcSubTotal();
  const vat = subTotal * 0.05;
  const discount = promotionCode[currentCode] || 0;
  const total = subTotal + vat - (discount / 100) * subTotal;

  $(".subtotal .value").text(
    subTotal.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    })
  );

  $(".vat .value").text(
    vat.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    })
  );

  $(".total .value").text(
    total.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    })
  );
}

// - Áp dụng mã giảm giá

const $promotion = $(".promotion");
const $code = $("#promo-code", $promotion);
const $button = $("button", $promotion);

$button.on("click", function (e) {
  const code = $code.val();

  if (code.toUpperCase() in promotionCode) {
    const discount = promotionCode[code.toUpperCase()];

    currentCode = code.toUpperCase();

    const $discount = $(".discount");
    $discount.removeClass("hide");
    $(".value", $discount).text(`${discount}%`);
    $callback.fire();
    alert("Áp dụng mã giảm giá thành công");
  } else {
    alert("Mã giảm giá không tồn tại");
  }
});

$callback.fire();
