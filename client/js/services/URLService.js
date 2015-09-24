angular.module('URLService', [])
    .factory('url', ['$http', function($http) {
        return {

            // call to find URL by id
            exists: function(id) {
                return $http.get('/api/url/exists/' + id);
            },

            // call to create new compressed URL
            create: function(data) {
                return $http.post('/api/url', data);
            },

            // call to delete compressed URL
            delete: function(id) {
                return $http.delete('/api/url/' + id);
            },

            // call to send email
            send: function(data) {
                return $http.post('/send', data);
            }
        }
    }]);