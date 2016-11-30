var BIMCloud = BIMCloud || {};

BIMCloud.imageButton = function (container, imageClass, clickImageClass, disableImageClass) {
    BIMCloud.Event.call(this);

    var scope = this;

    var isChecked = false;
    var isEnable = true;
    

    var element = document.createElement("div");
    element.classList.add("viewer5d-Menu-Button");
    element.classList.add(imageClass);

    element.onclick = function () {
        if (!isEnable || isChecked)
            return;
        scope.dispatchEvent({ type: "click" });
    };

    Object.defineProperty(this, "isChecked",
        {
            get: function () {
                return isChecked;
            },
            set: function (value) {
                isChecked = value;
                element.classList.remove(imageClass);
                element.classList.remove(clickImageClass);
                element.classList.remove(disableImageClass);
                if (isChecked) {
                    element.classList.add(clickImageClass);
                } else {
                    element.classList.add(imageClass);
                }
            }
        }
    );

    Object.defineProperty(this, "isEnable",
        {
            get: function () {
                return isEnable;
            },
            set: function (value) {
                isEnable = value;
                element.classList.remove(imageClass);
                element.classList.remove(clickImageClass);
                element.classList.remove(disableImageClass);
                if (isEnable) {
                    element.classList.add(imageClass);
                } else {
                    element.classList.add(disableImageClass);
                }
            }
        }
    );

    container.appendChild(element);
};

BIMCloud.imageButton.prototype = Object.create(BIMCloud.Event.prototype);

BIMCloud.imageButton.prototype.constructor = BIMCloud.imageButton;

