angular.module('AppController', ['ngAnimate', 'ui.bootstrap']).controller('AppController', function($scope, $http, url, $location, $timeout) {
    // id of current URL
    var curid = null;

    // init alerts
    $scope.alerts = [];

    // clear all fields and alerts
    $scope.clearAll = function () {
        $scope.longURL = "";
        $scope.compressedURL = "";
        $scope.alerts = [];
    };

    // clear field with compressed URL
    $scope.clearCompressedURL = function () {
        $scope.compressedURL = "";
    };

    // check to disable or enable button "Do"
    $scope.disabled_do = function () {
        return !$scope.longURL;
    };

    // check to disable or enable button "Send"
    $scope.disabled_send = function () {
        return !$scope.email || !$scope.compressedURL;
    };

    // check to disable or enable button "Destroy"
    $scope.disabled_destroy = function () {
        return !$scope.compressedURL;
    };

    // show division for delete compressed URL
    $scope.show_delete_div = function () {
        return $scope.compressedURL;
    };

    // push alert to the queue
    $scope.addAlert = function (type) {
        if (type == 'email-sending') {
            $scope.alerts.push({
                type: 'info',
                msg: 'Sending mail'
            });
        }
        else if (type == 'email-send-ok') {
            $scope.alerts.push({
                type: 'success',
                msg: 'Congrats! We just sent you email. Please check your email box'
            });
        }
        else if (type == 'email-send-failed') {
            $scope.alerts.push({
                type: 'danger',
                msg: 'Something was gone wrong while sending email. Please check email address which you typed'
            });
        }
        else if (type == 'delete-ok') {
            $scope.alerts.push(
                {
                    type: 'success',
                    msg: 'Congrats! Compressed URL was deleted'
                });
        }
        else if (type == 'delete-failed') {
            $scope.alerts.push({
                type: 'danger',
                msg: 'Something was gone wrong while deleting compressed URL'
            });
        }
        else if (type == 'delete-failed') {
            $scope.alerts.push({
                type: 'danger',
                msg: 'Something was gone wrong while deleting compressed URL'
            });
        }
        else if (type == 'id-updated') {
            $scope.alerts.push({
                type: 'info',
                msg: 'We have updated compressed URL because existing compressed URL was deleted'
            });
        }
    };

    // pop alert to the queue
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.closeLastAlert = function () {
        $scope.closeAlert($scope.alerts.length - 1);
    };

    // close previous alert and create new
    $scope.updateAlert = function (type) {
        $scope.closeLastAlert();
        $scope.addAlert(type);
    };

    // compress URL
    $scope.do = function (callback) {
        url.create({longURL: $scope.longURL})
            .success(function (ret) {
                $scope.compressedURL = $location.absUrl() + ret.compressedURL;
                curid = ret._id;

                return callback(true);
            });
    };

    // send email
    $scope.send = function () {
        // check if exists current id
        // it may caused if we was sent email with link to delete compressed URL and
        // user went to this link and current id was deleted
        url.exists(curid)
            .success(function (ret) {
                if (ret) {
                    // if it exists then send email with current id
                    // disable all elements on the page for correct sending email

                    // and show alert of sending
                    $scope.addAlert('email-sending');

                    url.send({
                        longURL: $scope.longURL,
                        compressedURL: $scope.compressedURL,
                        email: $scope.email,
                        _id: curid
                    })
                        .success(function () {
                            $scope.updateAlert('email-send-ok');
                        })
                        .error(function () {
                            $scope.updateAlert('email-send-failed');
                        });
                } else {
                    // if not exists first create a new compressed URL and current id
                    // update compressed URL on page
                    // then will send email with this new compressed URL and id
                    $scope.do(function (res) {
                        if (res) {
                            $scope.addAlert('email-sending');

                            url.send({
                                longURL: $scope.longURL,
                                compressedURL: $scope.compressedURL,
                                email: $scope.email,
                                _id: curid
                            })
                                .success(function () {
                                    $scope.updateAlert('email-send-ok');
                                })
                                .error(function () {
                                    $scope.updateAlert('email-send-failed');
                                });
                        }
                    });
                }
            }
        );
    };

    // destroy compressed URL
    $scope.destroy = function () {
        // delete current compressed URL and show notification alert
        url.delete(curid)
            .success(function () {
                $scope.clearAll();
                curid = null;

                $scope.addAlert('delete-ok');
            })
            .error(function () {
                $scope.addAlert('delete-failed');
            });

        // after 5 seconds hide alert
        $timeout(function () {
            $scope.closeLastAlert();
        }, 5000);
    };
});