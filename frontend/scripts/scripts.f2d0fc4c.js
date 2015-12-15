"use strict";
angular.module("cgeUploaderApp", ["ngAnimate", "ngCookies", "ngMessages", "ngResource", "ngRoute", "ngSanitize", "ngTouch", "ngFileUpload", "ui.bootstrap", "ui.grid", "ui.grid.resizeColumns", "ui.grid.autoResize", "ui.grid.exporter", "ui.bootstrap.collapse"])
  .config(["$routeProvider", "$httpProvider", function (a, b) {
    b.interceptors.push("AuthInterceptor"), a.when("/upload", {
        templateUrl: "views/upload.html",
        controller: "UploadCtrl",
        controllerAs: "upload"
      })
      .when("/download", {
        templateUrl: "views/download.html",
        controller: "DownloadCtrl",
        controllerAs: "download"
      })
      .when("/login", {
        templateUrl: "views/login.html",
        controller: "LoginCtrl",
        controllerAs: "login"
      })
      .otherwise({
        redirectTo: "/upload"
      })
  }])
  .run(["$rootScope", "$location", "$cookies", "$http", "$window", function (a, b, c, d, e) {
    a.$on("$locationChangeStart", function (a, d, e) {
      var f = c.get("token") || null;
      console.log(f);
      var g = -1 === $.inArray(b.path(), ["/login"]),
        h = f;
      !g || h && "undefined" !== h ? console.log("yuhu!") : b.path("/login")
    })
  }]), angular.module("cgeUploaderApp")
  .controller("MainCtrl", ["$scope", "$window", "$cookies", "$rootScope", "User", function (a, b, c, d, e) {
    a.loggedin = c.get("token") || void 0 !== c.get("token") || e.loggedIn ? !0 : !1, a.active = a.loggedin ? "upload" : "login", console.log(c.get("token")), a.user = c.get("user"), console.log(e), console.log(a.active, a.loggedin, void 0 !== c.get("token")), a.logout = function () {
      console.log("logging out"), e.loggedIn = !1, a.loggedin = !1, c.remove("token"), c.remove("user"), a.user = ""
    }, a.$on("nameUpdated", function () {
      a.user = e.name, a.loggedin = e.loggedIn, console.log(a.user)
    })
  }]), angular.module("cgeUploaderApp")
  .controller("AboutCtrl", function () {
    this.awesomeThings = ["HTML5 Boilerplate", "AngularJS", "Karma"]
  }), angular.module("cgeUploaderApp")
  .controller("RingtrialsCtrl", ["$scope", function (a) {
    a.isolateFiles = [], a.excelStatus = "init", a.filesValid = !0, a.tabs = [], a.messages = [], a.columnsExample = ["sample_name", "user_name", "file_names", "sequencing_platform", "sequencing_type", "email_address", "reference"], a.valuesExample = [{
      sample_name: "Sample_1",
      user_name: "gmi_user",
      file_names: "File_1.fastq File_2.fastq",
      sequencing_platform: "Illumina",
      sequencing_type: "paired",
      email_address: "my@email.com",
      reference: "CFSAN018751"
    }], a.metadataExampleCollapsed = !0
  }]), angular.module("cgeUploaderApp")
  .controller("BatchuploaderCtrl", ["$scope", function (a) {
    a.isolateFiles = [], a.excelStatus = "init", a.filesValid = !0, a.tabs = [], a.messages = [], a.metadataActive = !0, a.uploaderActive = !1, a.columnsExample = ["sample_name", "user_name", "file_names", "sequencing_platform", "sequencing_type", "email_address", "reference"], a.valuesExample = [{
      sample_name: "Sample_1",
      user_name: "gmi_user",
      file_names: "File_1.fastq File_2.fastq",
      sequencing_platform: "Illumina",
      sequencing_type: "paired",
      email_address: "my@email.com",
      reference: "CFSAN018751"
    }], a.metadataExampleCollapsed = !0, a.stepActive = "metadata"
  }]), angular.module("cgeUploaderApp")
  .controller("ServiceuploaderCtrl", ["$scope", function (a) {
    a.isolateFiles = [], a.templateFiles = [1], a.excelStatus = "valid", a.filesValid = !0
  }]), angular.module("cgeUploaderApp")
  .directive("uploaderProgress", function () {
    return {
      templateUrl: "templates/uploaderProgress.html",
      restrict: "E",
      link: function (a, b, c) {
        a.totalProgress = 0, a.isService = c.isService
      }
    }
  }), angular.module("cgeUploaderApp")
  .directive("dropFilesButton", function () {
    return {
      templateUrl: "templates/dropFilesButton.html",
      restrict: "E",
      link: function (a, b, c) {
        a.tabs = a.$parent.tabs, a.filesValid = !1, a.isService = c.isService, a.errors = !1, a.uploaded = !1, a.validate = function (b) {
          return "false" === a.isService ? _.contains(a.templateFiles, b.name) : (a.templateFiles.push(b.name), !0)
        }
      }
    }
  }), angular.module("cgeUploaderApp")
  .directive("submitUpload", ["Upload", "$timeout", "CalculateCheckSum", "UID", "$http", "$httpParamSerializer", "$cookies", function (a, b, c, d, e, f, g) {
    return {
      templateUrl: "templates/submitUpload.html",
      restrict: "E",
      link: function (h, i, j) {
        function k(b, c) {
          var e = d.updateUID();
          return b.formData ? console.log("I think we paused...", b.formData.upload_id) : (console.log("First time!"), b.formData = {
            file: b,
            test: "this is a test data",
            token: g.get("token"),
            uid: e
          }), a.upload({
            url: "http://127.0.0.1:8000/api/chunks",
            data: b.formData,
            sendFieldsAs: "form",
            transformResponse: function (a, d) {
              var e = angular.fromJson(a);
              b.formData.upload_id = e.upload_id, b.upload_id = b.formData.upload_id;
              var f = c;
              if (_.isEqual(_.keys(e), ["expires", "upload_id", "offset"])) {
                console.log("second thing"), e.offset + c >= b.size && (f = b.size - e.offset);
                var g = e.offset + f - 1;
                b.headers.CONTENT_RANGE = "bytes " + e.offset + "-" + g + "/" + f, console.log("bytes " + e.offset + "-" + g + "/" + f), console.log(b.formData.upload_id)
              } else console.log(e.detail), b.waiting = !1, h.fileError = b.pause ? h.fileError : !0, h.errorMessage = "" !== e.detail ? e.detail : "Error: Network connection"
            },
            method: "POST",
            file: b,
            resumeChunkSize: c,
            headers: b.headers,
            resumeSizeResponseReader: function (a) {
              console.log(a.size, b), b.resume = a.size;
              var d = c;
              b.resume + c >= b.size && (d = b.size - b.resume);
              var e = b.resume + d - 1;
              return b.headers.CONTENT_RANGE = "bytes " + b.resume + "-" + e + "/" + d, console.log("bytes " + b.resume + "-" + e + "/" + d), a.size
            },
            resumeSizeUrl: "http://127.0.0.1:8000/api/size?file=" + encodeURIComponent(b.name) + "&uid=" + (void 0 === b.upload_id ? "" : b.upload_id) + "&token=" + g.get("token")
          })
        }
        var l = 1048576,
          m = null;
        h.upload = function (a) {
          var d = a.meta,
            i = a.fileUploading,
            j = a.totalFiles;
          a.upload = k(a, l), a.upload.then(function (k) {
            b(function () {
              console.log("Done", k), a.result = k.config.data, a.waiting = !0, c.md5(a, l)
                .then(function (b) {
                  console.log(b, a.name, d, i, j), e({
                      url: "http://127.0.0.1:8000/api/save",
                      method: "POST",
                      data: f({
                        upload_id: a.result.upload_id,
                        md5: b,
                        meta: d,
                        token: g.get("token"),
                        sample_file: i,
                        total_file: j,
                        meta_id: m
                      }),
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                      },
                      transformResponse: function (a, b) {
                        if (j > i - 1) {
                          console.log("File #" + i);
                          var c = angular.fromJson(a);
                          console.log(c), m = c.meta_id
                        } else m = null
                      }
                    })
                    .then(function (c) {
                      a.success = !0, a.waiting = !1, h.paused = !1, h.filesUploaded += 1, h.filesUploaded === h.isolateFiles.length ? (console.log("DONE! sending SAVE META"), e({
                          url: "http://127.0.0.1:8000/api/meta/save",
                          method: "POST",
                          data: f({
                            upload_id: a.result.upload_id,
                            md5: b,
                            meta: d,
                            token: g.get("token"),
                            meta_id: m
                          }),
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                          }
                        })
                        .then(function (a) {
                          h.uploaded = !0, h.uploading = !1
                        })) : (console.log("we keep going..."), h.uploading = !0), a.paused = !1, a.uploading = !1, a.uploaded = !0, console.log(a.progress, c)
                    }, function (b) {
                      console.log(b), h.fileError = !0, a.waiting = !1;
                      var c = b.data.detail ? b.data.detail : b.data;
                      h.errorMessage = "Error: " + c
                    })
                })
            })
          }, function (b) {
            console.log(h.paused, a.pause), h.fileError = a.pause ? h.fileError : !0, console.log(b.detail), "" !== h.errorMessage && (h.errorMessage = b.detail ? b.detail : "Error: Network connection")
          }, function (b) {
            a.progress = Math.min(100, parseInt(100 * b.loaded / b.total))
          })
        }, h.uploadNGUpload = function () {
          if (h.uploading = !0, h.isolateFiles && h.isolateFiles.length) {
            console.log(h.metadata);
            var a = 0,
              b = 0;
            angular.forEach(h.isolateFiles, function (c) {
              c.$error || (c.totalFiles = h.metadata[a].file_names.split(" ")
                .length, c.headers = {}, b += 1, c.meta = h.metadata[a], c.fileUploading = b, b === c.totalFiles && (a += 1, b = 0))
            }), angular.forEach(h.isolateFiles, function (a) {
              h.upload(a)
            })
          }
        }
      }
    }
  }]), angular.module("cgeUploaderApp")
  .service("UID", function () {
    var a = function () {
      var a = new Date,
        b = a.getDay() + 1,
        c = a.getDate(),
        d = a.getFullYear(),
        e = a.getMonth() + 1,
        f = a.getHours(),
        g = a.getMinutes(),
        h = a.getMilliseconds(),
        i = Math.floor(1e6 * Math.random()) + 1,
        j = b + "_" + c + "_" + e + "_" + d + "_" + f + g + "_" + h + "_",
        k = j + i;
      return k
    };
    this.UID = a(), this.updateUID = function () {
      return a()
    }
  }), angular.module("cgeUploaderApp")
  .directive("metadata", ["ValidateMetadata", function (a) {
    return {
      templateUrl: "templates/metadata.html",
      restrict: "E",
      link: function (b, c, d) {
        b.excelStatus = "init", b.gridOptions = {
          showGridFooter: !0,
          enableSorting: !0,
          cellEditableCondition: !0
        }, b.visible = d.visible, b.$watch("excelFile", function (c, e) {
          if (e !== c && null !== c) {
            console.log(c, e), b.isolateFiles = [], b.gridOptions.data = [], b.gridOptions.columnDefs = [];
            var f = new FileReader;
            f.readAsBinaryString(c), f.onload = function (c) {
              var e = XLSX.read(c.target.result, {
                  type: "binary"
                }),
                f = e.SheetNames,
                g = e.Sheets[f[0]],
                h = XLSX.utils.sheet_to_json(g);
              console.log(h), 0 === h.length ? (console.log("Metadata file is empty"), b.excelStatus = "error", b.message = "Metadata file is empty!") : a.parse(h, d.file)
                .then(function (a) {
                  angular.extend(b, a), angular.forEach(b.columns, function (a) {
                    b.gridOptions.columnDefs.push({
                      field: a,
                      width: "20%"
                    })
                  }), b.gridOptions.data = a.metadata
                })
            }
          }
        })
      }
    }
  }]), angular.module("cgeUploaderApp")
  .service("ValidateMetadata", ["LoadMetadata", "$q", "UID", function (a, b, c) {
    this.parse = function (d, e) {
      var f = b.defer(),
        g = f.promise,
        h = {
          message: "",
          excelStatus: "init",
          errorMessages: [],
          columns: [],
          values: [],
          templateFiles: [],
          warning: !1,
          warningMessages: []
        };
      return console.log("starting...", d, e), a.source(e)
        .getJSON(function (a) {
          a = angular.fromJson(angular.toJson(a));
          var b = _.keys(a.columns),
            e = [],
            g = 1;
          angular.forEach(d, function (d) {
            var f = 0,
              i = _.keys(d),
              j = _.difference(b, i),
              k = _.object(j, _.map(j, function () {
                return ""
              }));
            _.extendOwn(d, k), d.meta_uid = c.updateUID(), angular.forEach(a.mandatory, function (b) {
              var c = a.columns[b];
              if (typeof c == typeof []) _.contains(c, d[b].trim()) || (h.errorMessages.push("[Line " + g.toString() + "] " + b + " " + d[b] + " is not a valid option"), console.log("[Line " + g.toString() + "] " + b + " " + d[b] + " is not a valid option"), h.excelStatus = "error");
              else if ("" === d[b].trim() && (console.log("[Line " + g.toString() + "] Missing value for " + b + " "), h.errorMessages.push("[Line " + g.toString() + "] Missing value for " + b + " "), h.excelStatus = "error"), "file_names" === b) {
                var i = d[b].split(" ");
                i.forEach(function (a) {
                  if ("" === a) {
                    var b = "[Line " + g.toString() + "] File missing";
                    h.errorMessages.push(b), h.excelStatus = "error"
                  } else e.push(a)
                })
              } else if ("collection_date" === b) {
                var j = moment(d[b], ["YYYY-MM-DD", "YYYY-MM", "YYYY"], !0);
                if (!j.isValid()) {
                  console.log("error in date");
                  var k = "[Line " + g.toString() + "] Date has a wrong format";
                  h.errorMessages.push(k), h.excelStatus = "error"
                }
              }
              f += 1
            }), g += 1
          }), h.columns = _.keys(d[0]), h.metadata = d, h.excelStatus = "error" !== h.excelStatus ? "valid" : "error", "error" === h.excelStatus && (h.message = "Metadata is invalid"), h.templateFiles = e, f.resolve(h)
        }), g
    }
  }]), angular.module("cgeUploaderApp")
  .factory("LoadMetadata", ["$resource", function (a) {
    return {
      source: function (b) {
        console.log(b);
        var c = a("metadata/" + b + ".json", {}, {
          getJSON: {
            method: "GET"
          }
        });
        return c
      }
    }
  }]), angular.module("cgeUploaderApp")
  .controller("Batchuploader2Ctrl", ["$scope", function (a) {
    a.isolateFiles = [], a.excelStatus = "init", a.filesValid = !0, a.tabs = [], a.messages = [], a.metadataActive = !0, a.uploaderActive = !1, a.columnsExample = ["sample_name", "user_name", "file_names", "sequencing_platform", "sequencing_type", "email_address", "reference"], a.valuesExample = [{
      sample_name: "Sample_1",
      user_name: "gmi_user",
      file_names: "File_1.fastq File_2.fastq",
      sequencing_platform: "Illumina",
      sequencing_type: "paired",
      email_address: "my@email.com",
      reference: "CFSAN018751"
    }], a.metadataExampleCollapsed = !0, a.stepActive = "metadata", a.fileError = !1, a.errorMessage = "", a.isCollapsed = !0, a.paused = !1, a.uploading = !1, a.uploaded = !1
  }]), angular.module("cgeUploaderApp")
  .service("CalculateCheckSum", ["$q", function (a) {
    this.md5 = function (b, c) {
      function d() {
        var a = i * c,
          d = a + c >= b.size ? b.size : a + c;
        k.readAsArrayBuffer(g.call(b, a, d))
      }
      var e = a.defer(),
        f = e.promise,
        g = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        h = Math.ceil(b.size / c),
        i = 0,
        j = new SparkMD5.ArrayBuffer,
        k = new FileReader;
      return k.onload = function (a) {
        if (j.append(a.target.result), i++, h > i) d();
        else {
          var b = j.end();
          console.info("computed md5", b), e.resolve(b)
        }
      }, k.onerror = function () {
        console.warn("oops, something went wrong.")
      }, console.log(b.name, c), d(), f
    }, this.hash = function () {
      return Math.random()
        .toString(32)
        .slice(2)
    }, this.sha512 = function (b, c) {
      function d() {
        var a = i * c,
          d = a + c >= b.size ? b.size : a + c;
        l.readAsText(g.call(b, a, d))
      }
      var e = a.defer(),
        f = e.promise,
        g = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        h = Math.ceil(b.size / c),
        i = 0,
        j = new jsSHA("SHA-512", "TEXT"),
        k = "",
        l = new FileReader;
      return l.onload = function (a) {
        if (k.concat(a.target.result), i++, h > i) d();
        else {
          var b = j.getHash("HEX");
          e.resolve(b)
        }
      }, l.onerror = function () {
        console.warn("oops, something went wrong.")
      }, d(), f
    }
  }]), angular.module("cgeUploaderApp")
  .controller("FileSharingCtrl", function () {
    this.awesomeThings = ["HTML5 Boilerplate", "AngularJS", "Karma"]
  }), angular.module("cgeUploaderApp")
  .controller("UploadCtrl", ["$scope", function (a) {
    a.isolateFiles = [], a.excelStatus = "init", a.filesValid = !0, a.tabs = [], a.messages = [], a.metadataActive = !0, a.uploaderActive = !1, a.columnsExample = ["sample_name", "user_name", "file_names", "sequencing_platform", "sequencing_type", "email_address", "reference"], a.valuesExample = [{
      sample_name: "Sample_1",
      user_name: "gmi_user",
      file_names: "File_1.fastq File_2.fastq",
      sequencing_platform: "Illumina",
      sequencing_type: "paired",
      email_address: "my@email.com",
      reference: "CFSAN018751"
    }], a.metadataExampleCollapsed = !0, a.stepActive = "metadata", a.fileError = !1, a.errorMessage = "", a.isCollapsed = !0, a.paused = !1, a.uploading = !1, a.uploaded = !1, a.filesUploaded = 0
  }]), angular.module("cgeUploaderApp")
  .controller("DownloadCtrl", ["$scope", "$http", "$httpParamSerializer", "$cookies", "$resource", "$window", "$location", function (a, b, c, d, e, f, g) {
    a.metadataExampleCollapsed = !0, a.metadataActive = !0, a.downloadFile = function (a, b) {
        console.log(a.entity.meta_id);
        var c = angular.element("#" + a.entity.meta_id);
        c.attr({
          href: "http://127.0.0.1:8000/api/file?token=" + d.get("token") + "&file_id=" + b,
          target: "_self",
          download: "file.data"
        })[0].click()
      }, a.gridOptions = {
        showGridFooter: !0,
        enableSorting: !0,
        enableFiltering: !0,
        cellEditableCondition: !0,
        exporterMenuCsv: !0,
        exporterMenuPdf: !1,
        enableGridMenu: !0,
        columnDefs: [{
          field: "Download",
          width: "7%",
          displayName: "",
          enableFiltering: !1,
          enableSorting: !1,
          enableHiding: !1,
          enableColumnMenu: !1,
          cellTemplate: '<a ng-hide=true id="{{row.entity.meta_id}}"></a><button ng-click="grid.appScope.downloadFile(row, row.entity.files[0]);"class="btn file-download"><i class="mdi-file-file-download"></i></button><button ng-show="row.entity.n_files > 1" ng-click="grid.appScope.downloadFile(row, row.entity.files[1]);"class="btn file-download"><i class="mdi-file-file-download"></i></button>',
          cellClass: function (a, b, c, d, e) {
            return "text-center"
          }
        }, {
          field: "sample_name",
          width: "15%"
        }, {
          field: "user",
          width: "8%",
          displayName: "User"
        }, {
          field: "file_names",
          width: "20%",
          displayName: "File Names"
        }, {
          field: "created_on",
          displayName: "Uploaded on",
          width: "25%",
          cellFilter: "date"
        }, {
          field: "sequencing_platform",
          width: "15%"
        }, {
          field: "sequencing_type",
          width: "15%"
        }, {
          field: "pre_assembled",
          width: "25%"
        }, {
          field: "sample_type",
          width: "25%"
        }, {
          field: "organism",
          width: "25%"
        }, {
          field: "strain",
          width: "25%"
        }, {
          field: "subtype",
          width: "25%"
        }, {
          field: "country",
          width: "25%"
        }, {
          field: "region",
          width: "25%"
        }, {
          field: "city",
          width: "25%"
        }, {
          field: "zip_code",
          width: "25%"
        }, {
          field: "longitude",
          width: "25%"
        }, {
          field: "latitude",
          width: "25%"
        }, {
          field: "location_note",
          width: "25%"
        }, {
          field: "isolation_source",
          width: "25%"
        }, {
          field: "source_note",
          width: "25%"
        }, {
          field: "pathogenic",
          width: "25%"
        }, {
          field: "pathogenicity_note",
          width: "25%"
        }, {
          field: "collection_date",
          width: "25%"
        }, {
          field: "collected_by",
          width: "25%"
        }, {
          field: "usage_restrictions",
          width: "25%"
        }, {
          field: "release_date",
          width: "25%"
        }, {
          field: "email_address",
          width: "25%"
        }, {
          field: "notes",
          width: "25%"
        }]
      }, b({
        url: "http://127.0.0.1:8000/api/data",
        method: "GET",
        params: {
          token: d.get("token")
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      })
      .then(function (b) {
        var c = angular.fromJson(b.data);
        a.gridOptions.data = [], angular.forEach(c, function (b) {
          console.log(b), a.gridOptions.data.push(b.fields)
        })
      }, function (b) {
        console.log(b);
        var c = b.data.detail ? b.data.detail : b.data;
        a.errorMessage = "Error: " + c
      })
  }]), angular.module("cgeUploaderApp")
  .controller("LoginCtrl", ["AuthenticationService", "$scope", "$location", "$window", "$cookies", "$rootScope", "User", function (a, b, c, d, e, f, g) {
    b.isAuthenticated = !1, b.error = !1, b.loginUser = function () {
      console.log("lala"), b.dataLoading = !0, a.login(b.username, b.password, function (a, d, h, i) {
        e.put("token", a.token), e.put("user", b.username), b.isAuthenticated = !0, console.log(a), c.path("/upload"), console.log(b.username), g.setName(b.username), console.log(g), f.$emit("loggedIn")
      }, function (a, c, d, f) {
        b.isAuthenticated = !1, e.remove("token"), e.remove("user"), b.loginError = "Error: Invalid user or password", b.dataLoading = !1, b.error = !0
      })
    }, b.logout = function () {
      b.welcome = "", b.message = "", b.isAuthenticated = !1, b.error = !1, e.remove("token"), e.remove("user")
    }
  }]), angular.module("cgeUploaderApp")
  .service("AuthenticationService", ["$http", function (a) {
    this.login = function (b, c, d, e) {
      console.log(b, c), a.post("http://127.0.0.1:8000/login/", {
          username: b,
          password: c,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
        .success(function (a, b, c, e) {
          d(a, b, c, e)
        })
        .error(function (a, b, c, d) {
          e(a, b, c, d)
        })
    }
  }]), angular.module("cgeUploaderApp")
  .factory("AuthInterceptor", ["$window", "$q", function (a, b) {
    return {
      request: function (b) {
        return b.headers = b.headers || {}, a.sessionStorage.token && (b.headers.Authorization = "Bearer " + a.sessionStorage.token), b
      },
      responseError: function (a) {
        return 401 === a.status, b.reject(a)
      }
    }
  }]), angular.module("cgeUploaderApp")
  .factory("User", ["$rootScope", function (a) {
    var b = {
      name: "",
      setName: function (c) {
        b.name = c, b.loggedIn = !0, a.$broadcast("nameUpdated")
      },
      loggedIn: !1
    };
    return b
  }]), angular.module("cgeUploaderApp")
  .run(["$templateCache", function (a) {
    a.put("views/about.html", "<p>This is the about view.</p>"), a.put("views/batchuploader.html", '<div ng-controller="BatchuploaderCtrl"> <div class="well well-lg"> <div class="row"> <div class="col-xs-6-offset-1"> <h2 class="text-right"> CGE Pipeline Uploader <button ng-click="stepActive=\'metadata\'" class="btn btn-fab btn-raised btn-material-red-900"> <i class="mdi-action-language"></i> </button> </h2> <!-- <p class="text-right">Here you can find a small guide on how to use the uploader</p> --> <!-- <div class="well well-lg" ng-show="stepActive === \'uploader\'" > --> </div> </div> <div class="row"> <div class="col-xs-6"> <h3 class="text-left"> <button ng-click="stepActive=\'metadata\'" class="btn btn-fab btn-raised" ng-class="{\'btn-material-light-green-700\' : (stepActive === \'uploader\'),\n                                       \'btn-material-green-900\' : (stepActive === \'metadata\')}"> <i class="mdi-editor-insert-chart"></i> </button> <strong ng-show="stepActive === \'metadata\'">Metadata Spreadsheet</strong> <span ng-hide="stepActive === \'metadata\'">Metadata Spreadsheet</span> </h3> </div> <h3 class="col-xs-6"> <p class="container"> <div class="row"> <p class="text-left col-xs-6"> <i role="button" class="material-black mdi-file-file-download" href="metadata/metadataform_ringtrials.xlsx"> </i> Spreadsheet </p> <p class="text-right col-xs-6"> <i ng-show="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-more" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> <i ng-hide="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-less" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> Information </p> </div> </p> </h3> </div> <div collapse="metadataExampleCollapsed"> <table class="table"> <p style="font:smaller"> </p><p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p> <p>Metadata ensures that our data is stored according to our standards. In order to user our uploader you need to download an excel sheet that you must fill out with the proper information.</p> <p>Remember to check the tab ‘Attribute description’ indicating the required contents. In the template, each line corresponds to one sample.</p> <p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p>  <thead> <tr> <th ng-repeat="column in columnsExample">{{column}}</th> </tr> </thead> <tbody> <tr class="danger" ng-repeat="isolate in valuesExample" style="font:smaller"> <td ng-repeat="(key, value) in isolate"> <strong>{{ value }}</strong> </td> </tr> </tbody> </table> </div> </div> <metadata file="ringTrials" ng-show="stepActive === \'metadata\'"></metadata> <div class="well well-lg"> <h3> <button ng-click="stepActive=\'uploader\'" class="btn btn-fab btn-raised" ng-class="{\'btn-material-light-blue-700\' : (stepActive === \'metadata\'),\n                             \'btn-material-blue-900\' : (stepActive === \'uploader\')}"> <i class="mdi-action-note-add"></i> </button> <strong ng-hide="stepActive === \'metadata\'">Isolate Files</strong> <span ng-show="stepActive === \'metadata\'">Isolate Files</span> </h3> </div> <div class="well well-lg animate-hide" ng-hide="stepActive === \'metadata\'"> <drop-files-button active="excelStatus" is-service="false"></drop-files-button> <uploader-progress is-service="false"></uploader-progress> <div ng-show="excelStatus === \'valid\'  &&\n               isolateFiles.length === templateFiles.length"> <p class="text-center"><submit-upload></submit-upload></p> </div> </div> </div>'), a.put("views/batchuploader2.html", '<div ng-controller="Batchuploader2Ctrl"> <div class="well well-lg" id="compare"> <div class="row"> <div class="col-xs-6-offset-1"> <h2 class="text-right"> ENGAGE File-sharing <button ng-click="stepActive=\'metadataActive\'" class="btn btn-fab btn-raised btn-material-red-900"> <i class="mdi-action-language"></i> </button> </h2> <!-- <p class="text-right">Here you can find a small guide on how to use the uploader</p> --> <!-- <div class="well well-lg" ng-show="stepActive === \'uploader\'" > --> </div> </div> <div class="row"> <div class="col-xs-6"> <h3 class="text-left"> <button ng-click="metadataActive = !metadataActive" class="btn btn-fab btn-raised" ng-class="{\'btn-material-light-green-700\' : !metadataActive,\n                                       \'btn-material-green-900\' : metadataActive}"> <i class="mdi-editor-insert-chart"></i> </button> <strong ng-show="metadataActive">Metadata Sheet</strong> <span ng-hide="metadataActive">Metadata Sheet</span> </h3> </div> <h3 class="col-xs-6"> <p class="container"> <div class="row"> <p class="text-left col-xs-6"> <i role="button" class="material-black mdi-file-file-download" href="metadata/metadataform_ringtrials.xlsx"> </i> Sheet </p> <p class="text-right col-xs-6"> <i ng-show="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-more" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> <i ng-hide="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-less" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> Info </p> </div> </p> </h3> </div> <div collapse="metadataExampleCollapsed"> <table class="table"> <p style="font:smaller"> </p><p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p> <p>Metadata ensures that our data is stored according to our standards. In order to user our uploader you need to download an excel sheet that you must fill out with the proper information.</p> <p>Remember to check the tab ‘Attribute description’ indicating the required contents. In the template, each line corresponds to one sample.</p> <p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p>  <thead> <tr> <th ng-repeat="column in columnsExample">{{column}}</th> </tr> </thead> <tbody> <tr class="danger" ng-repeat="isolate in valuesExample" style="font:smaller"> <td ng-repeat="(key, value) in isolate"> <strong>{{ value }}</strong> </td> </tr> </tbody> </table> </div> </div> <metadata file="ringTrials" ng-show="metadataActive"></metadata> <div class="well well-lg"> <h3> <button ng-click="uploaderActive = !uploaderActive" class="btn btn-fab btn-raised" ng-class="{\'btn-material-light-blue-700\' : !uploaderActive,\n                             \'btn-material-blue-900\' : uploaderActive}"> <i class="mdi-action-note-add"></i> </button> <strong ng-show="uploaderActive">Isolate Files</strong> <span ng-hide="uploaderActive">Isolate Files</span> </h3> </div> <div class="well well-lg animate-hide" ng-hide="!uploaderActive"> <drop-files-button active="excelStatus" is-service="false"></drop-files-button> <uploader-progress is-service="false"></uploader-progress> <div ng-show="excelStatus === \'valid\'  &&\n               isolateFiles.length === templateFiles.length"> <p class="text-center"> <submit-upload></submit-upload> </p> </div> </div> </div>'), a.put("views/download.html", '<!-- <div ui-grid="gridOptions" class="myGrid" ui-grid-auto-resize></div> --><!-- <input ng-model=\'filterValue\'/><button ng-click=\'filter()\'>Filter</button> --> <div class="well well-lg" id="compare"> <div class="row"> <div class="col-xs-6-offset-1"> <h2 class="text-right"> <!-- File-Sharing --> <button ng-click="stepActive=\'metadataActive\'" class="btn btn-fab btn-raised btn-material-red-900"> <i class="mdi-action-language"></i> </button> </h2> <!-- <p class="text-right">Here you can find a small guide on how to use the uploader</p> --> <!-- <div class="well well-lg" ng-show="stepActive === \'uploader\'" > --> </div> </div> <div class="row"> <div class="col-xs-6"> <h3 class="text-left"> <button ng-click="metadataActive = !metadataActive" class="btn btn-fab btn-raised" ng-class="{\'btn-material-light-green-700\' : !metadataActive,\n                                   \'btn-material-green-900\' : metadataActive}"> <i class="mdi-file-cloud-download"></i> </button> <strong ng-show="metadataActive">File Server</strong> <span ng-hide="metadataActive">File Server</span> </h3> </div> <h3 class="col-xs-6"> <p class="container"> <div class="row"> <!-- <p class="text-left col-xs-6">\n                        <i role="button" class="material-black mdi-file-file-download" href="metadata/metadataform_ringtrials.xlsx">\n                        </i>\n                        All\n                    </p> --> <p class="text-right col-xs-6 col-xs-offset-6"> <i ng-show="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-more" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> <i ng-hide="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-less" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> Info </p> </div> </p> </h3> </div> <div collapse="metadataExampleCollapsed"> <table class="table"> <p style="font:smaller"> </p><p>The table bellow shows an overview of the files uploaded to the server, along with metadata of each sample.</p> <p>Here you can download individual file and their metadata, or simple filter the table and download a CSV file with you selection</p> <!-- <p>Remember to check the tab ‘Attribute description’ indicating the required contents. In the template, each line corresponds to one sample.</p> --> <!-- <p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p> -->  <thead> <tr> <th ng-repeat="column in columnsExample">{{column}}</th> </tr> </thead> <tbody> <tr class="danger" ng-repeat="isolate in valuesExample" style="font:smaller"> <td ng-repeat="(key, value) in isolate"> <strong>{{ value }}</strong> </td> </tr> </tbody> </table> </div> </div> <div ui-grid="gridOptions" class="myGrid" ui-grid-auto-resize ui-grid-exporter ui-grid-resize-columns></div> <p id="test"></p>'), a.put("views/file-sharing.html", "<p>This is the file-sharing view.</p>"), a.put("views/login.html", '<div class="well well-lg" id="compare"> <div class="row"> <div class="col-xs-6-offset-1"> <h2 class="text-right"> <!-- File-Sharing --> <button ng-click="stepActive=\'metadataActive\'" class="btn btn-fab btn-raised btn-material-red-900"> <i class="mdi-action-language"></i> </button> </h2> <!-- <p class="text-right">Here you can find a small guide on how to use the uploader</p> --> <!-- <div class="well well-lg" ng-show="stepActive === \'uploader\'" > --> </div> </div> </div> <div class="well well-lg"> <div class="row"> <div class="col-xs-6 col-xs-offset-3"> <h2>Login</h2> <form name="form" ng-submit="loginUser()" role="form"> <div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"> <label for="username">Username</label> <input type="text" name="username" id="username" class="form-control" ng-model="username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span> </div> <div class="form-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"> <label for="password">Password</label> <input type="password" name="password" id="password" class="form-control" ng-model="password" required> <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span> </div> <div class="form-actions"> <div class="row"> <div class="col-xs-3"> <!-- <button type="submit" ng-disabled="form.$invalid || dataLoading" class="btn btn-default">Login</button> --> <button ng-disabled="form.$invalid || dataLoading" ng-click="stepActive=\'metadataActive\'" class="btn btn-fab btn-raised btn-material-blue-900"> <i class="mdi-action-account-circle"></i> </button> </div> <div class="col-xs-9" style="margin-top:18px" ng-show="error || isAuthenticated"> <span class="label label-warning" ng-show="error"> <span class="sr-only">Error:</span> <span>{{loginError}}</span> </span> <span class="label label-success" ng-show="isAuthenticated"> <span>User authenticated!</span> </span> </div> </div> </div> </form> </div> </div> </div>'), a.put("views/main.html", '<div class="jumbotron"> <h1>\'Allo, \'Allo!</h1> <!-- <h4><a class="btn btn-lg btn-success" ng-href="#/ringtrials">Rings!<span class="glyphicon glyphicon-ok"></span></a><h4>\n  <h4><a class="btn btn-lg btn-success" ng-href="#/batchuploader">Rings!<span class="glyphicon glyphicon-ok"></span></a><h4>\n  <h4><a class="btn btn-lg btn-success" ng-href="#/serviceuploader">Rings!<span class="glyphicon glyphicon-ok"></span></a><h4> --> <h2>Questions:</h2> <ul> <li><h3>Metadata captured for COMPARE:</h3> <ul> <li><h4>Attributes?<h4></h4></h4></li> <li><h4>Mandatory fields?<h4></h4></h4></li> </ul> </li> <li><h3>Metadata captured for ENGAGE:</h3> <ul> <li><h4>Attributes?<h4></h4></h4></li> <li><h4>Mandatory fields?<h4></h4></h4></li> </ul> </li> <li><h3>Download:</h3> <ul> <li><h4>What to display?</h4> <ul> <li><h4>samples plus user who uploaded?<h4></h4></h4></li> <li><h4>users and expandable view to show their metadata?<h4></h4></h4></li> <li><h4>global metadata?<h4></h4></h4></li> </ul> </li> <li><h4>How to display it?</h4> <ul> <li><h4>by user?<h4></h4></h4></li> <li><h4>by sample?<h4></h4></h4></li> <li><h4>other criteria...<h4></h4></h4></li> </ul> </li> </ul> </li> </ul> <h2>Rene\'s whishlist:</h2> <ul> <li><h4><i class="glyphicon glyphicon-ok"></i>To change the header of the upload / download page from CGE to Compare and one for Engage.<h4></h4></h4></li> <li><h4><i class="glyphicon glyphicon-ok"></i>To include “user” in the data string for uploads.<h4></h4></h4></li> <li><h4><i class="glyphicon glyphicon-ok"></i>To create a tool to generate an overall Excel file of all data submitted – should allow for filtering.<h4></h4></h4></li> <li><h4><i class="glyphicon glyphicon-hourglass"></i>To download to own computer interesting genome files based on the Excel filtering.<h4></h4></h4></li> <li><h4><i class="glyphicon glyphicon-remove"></i>To prepare at least 20 logins for Compare and 10 for Engage which we could easily distribute on request.<h4></h4></h4></li> <li><h4><i class="glyphicon glyphicon-hourglass"></i>To ensure at least one user access without the user being kicked off when new users login. Preferable access of multiple users at the same time.<h4></h4></h4></li> <li><h4><i class="glyphicon glyphicon-ok"></i>To allow access from outside of DTU – should be possible in two days.<h4></h4></h4></li> <li><h4><i class="glyphicon glyphicon-remove"></i>To have Rolf and Oksana test the features before going live.<h4></h4></h4></li> </ul> </div>'), a.put("views/ringtrials.html", '<div ng-controller="RingtrialsCtrl"> <tabset justified="true" type="tabs"> <!-- <tab heading="Intro">\n          <div class="jumbotron">\n            <h2>Welcome to the QC pipeline Uploader</h2>\n            <p>Here you can find a small guide on how to use the uploader</p>\n            <p class="text-right">\n                <button ng-click="tabs[1].active = true" class="btn btn-fab btn-raised btn-material-red-900"><i class="mdi-navigation-arrow-forward"></i></button>\n            </p>\n\n          </div>\n      </tab> --> <tab heading="Metadata Spreadsheet"> <div class="well well-lg"> <h2>QC Pipeline Uploader</h2> <p>Here you can find a small guide on how to use the uploader</p> <!-- <p>...</p> --> <!-- <p><a class="btn btn-material-red-900 btn-lg" ng-click="tabs[1].active = true" role="button">To move to the next step click here</a></p> --> <!-- <p class="text-right">\n                    <button ng-click="tabs[1].active = true" class="btn btn-fab btn-raised btn-material-red-900"><i class="mdi-navigation-arrow-forward"></i></button>\n                </p> --> <h4> <p class="container"> <div class="row"> <p class="text-left col-xs-6"> <i role="button" class="material-black mdi-file-file-download" href="metadata/metadataform_ringtrials.xlsx"> </i> Spreadsheet </p> <p class="text-right col-xs-6"> <i ng-show="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-more" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> <i ng-hide="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-less" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> Information </p> </div> </p> </h4> <div collapse="metadataExampleCollapsed"> <p>Metadata ensures that our data is stored according to our standards. In order to user our uploader you need to download an excel sheet that you must fill out with the proper information.</p> <p>Remember to check the tab ‘Attribute description’ indicating the required contents. In the template, each line corresponds to one sample.</p> <p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p> <table class="table"> <thead> <tr> <th ng-repeat="column in columnsExample">{{column}}</th> </tr> </thead> <tbody> <tr class="danger" ng-repeat="isolate in valuesExample" style="font:smaller"> <td ng-repeat="(key, value) in isolate"> <strong>{{ value }}</strong> </td> </tr> </tbody> </table> </div> </div> <metadata file="ringTrials" visible></metadata> <div ng-show="excelStatus === \'valid\'" class="well well-lg text-center"> <p>Take a look at the table above and review the metadata</p> <p>If you find any error simply upload your updated excel file again</p> <p class="text-center"> <button ng-click="tabs[1].active = true" class="btn btn-fab btn-raised btn-material-green-900"> <i class="mdi-navigation-arrow-forward"></i> </button> </p> </div> </tab> <tab heading="File Upload"> <div class="well well-lg text-left"> <p>Here you can upload your sequences and see the progress of the upload for each file.</p> <p>If there are any problems while uploading the files you can resume them later.</p> </div> <drop-files-button active="excelStatus" is-service="false"></drop-files-button> <uploader-progress is-service="false"></uploader-progress> <div class="well well-lg" ng-show="excelStatus === \'valid\'  &&\n                   isolateFiles.length === templateFiles.length"> <p class="text-center"><submit-upload></submit-upload></p> After upload is complete, please insert your email address in the popup screen after submission and await the QC results either on screen or by email. Depending on the number of ongoing submissions, it might be a while before the database responds with an email indicating the QC-results. Subsequent to the deadline for submission, additional calculations and QC-results will be sent to the email address indicated in the metadatafile. </div> </tab> </tabset> </div>'),
      a.put("views/serviceuploader.html", '<div ng-controller="ServiceuploaderCtrl"> <drop-files-button active="true" is-service="true"></drop-files-button> <div class="well well-lg"> <uploader-progress is-service="true"></uploader-progress> <div ng-show="excelStatus === \'valid\'  &&\n                 isolateFiles.length !== 0"> <p class="text-center"><submit-upload></submit-upload></p> </div> </div> </div>'), a.put("views/upload.html", '<div ng-controller="UploadCtrl"> <div class="well well-lg" id="compare"> <div class="row"> <div class="col-xs-6-offset-1"> <h2 class="text-right"> <!-- File-Sharing --> <button ng-click="stepActive=\'metadataActive\'" class="btn btn-fab btn-raised btn-material-red-900"> <i class="mdi-action-language"></i> </button> </h2> <!-- <p class="text-right">Here you can find a small guide on how to use the uploader</p> --> <!-- <div class="well well-lg" ng-show="stepActive === \'uploader\'" > --> </div> </div> <div class="row"> <div class="col-xs-6"> <h3 class="text-left"> <button ng-click="metadataActive = !metadataActive" class="btn btn-fab btn-raised" ng-class="{\'btn-material-light-green-700\' : !metadataActive,\n                                       \'btn-material-green-900\' : metadataActive}"> <i class="mdi-editor-insert-chart"></i> </button> <strong ng-show="metadataActive">Metadata</strong> <span ng-hide="metadataActive">Metadata</span> </h3> </div> <h3 class="col-xs-6"> <p class="container"> <div class="row"> <p class="text-left col-xs-6"> <a type="button" role="button" class="material-black mdi-file-file-download" href="metadata/metadataform_ringtrials.xlsx"> </a> Sheet </p> <p class="text-right col-xs-6"> <i ng-show="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-more" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> <i ng-hide="metadataExampleCollapsed" role="button" class="material-white mdi-navigation-expand-less" ng-click="metadataExampleCollapsed = !metadataExampleCollapsed"> </i> Info </p> </div> </p> </h3> </div> <div collapse="metadataExampleCollapsed"> <table class="table"> <p style="font:smaller"> </p><p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p> <p>Metadata ensures that our data is stored according to our standards. In order to user our uploader you need to download an excel sheet that you must fill out with the proper information.</p> <p>Remember to check the tab ‘Attribute description’ indicating the required contents. In the template, each line corresponds to one sample.</p> <p>Batch-upload is available to list information related to all relevant samples in the same spreadsheet.</p>  <thead> <tr> <th ng-repeat="column in columnsExample">{{column}}</th> </tr> </thead> <tbody> <tr class="danger" ng-repeat="isolate in valuesExample" style="font:smaller"> <td ng-repeat="(key, value) in isolate"> <strong>{{ value }}</strong> </td> </tr> </tbody> </table> </div> </div> <metadata file="batch" ng-show="metadataActive"></metadata> <div class="well well-lg"> <h3> <button ng-click="uploaderActive = !uploaderActive" class="btn btn-fab btn-raised" ng-class="{\'btn-material-light-blue-700\' : !uploaderActive,\n                             \'btn-material-blue-900\' : uploaderActive}"> <i class="mdi-action-note-add"></i> </button> <strong ng-show="uploaderActive">Sequences</strong> <span ng-hide="uploaderActive">Sequences</span> </h3> </div> <div class="well well-lg animate-hide" ng-hide="!uploaderActive"> <drop-files-button active="excelStatus" is-service="false"></drop-files-button> <uploader-progress is-service="false"></uploader-progress> <div ng-show="excelStatus === \'valid\'  &&\n               isolateFiles.length === templateFiles.length"> <p class="text-center"> <submit-upload></submit-upload> </p> </div> </div> </div>')
  }]);
