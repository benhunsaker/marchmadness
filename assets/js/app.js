Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
	return Handlebars.compile(rawTemplate);
};

$(function () {	
	var MarchMadness = new Marionette.Application();	  
	
	MarchMadness.addRegions({
		layout: "#app"
	});

	MarchMadness.Pool = Backbone.Model.extend({
		url: "/pool"
	});
	MarchMadness.Pools = Backbone.Collection.extend({
		model: MarchMadness.Pool
		, url: "/pool"
	});

	MarchMadness.MyLayoutView = Marionette.Layout.extend({
		template: "#layoutTemplate"
		, regions: {
			content: "#content"
			, poolDropdown: "#poolDropDown"		
			, module: "#module"
		}
	});

	MarchMadness.PoolDropdownListItem = Marionette.ItemView.extend({
		template: "#poolDropdownItemTemplate"
		, tagName: "li"
	});

	MarchMadness.PoolFormView = Marionette.ItemView.extend({
		template: "#newPoolForm"
		, tagName: "div"
		, className: "modal fade"
		, ul: {
			form: "form"
		}
		, onBeforeRender: function () {
			var that = this;
			this.$el.hide();
			this.$el.on('hidden.bs.modal', function (e) {
			  that.collection.off("sync", that.hide, that);
			});
		}
		, onRender: function () {
			this.$el.modal('show');
		}
		, events: {
			"click button[type=submit]": "createPool"
		}
		, createPool: function (e) {
			e.preventDefault();
			var that = this,
					formData = $(this.ul.form).serializeJSON();
			
			this.collection.once("sync", this.hide, this);
			this.collection.create(formData, {wait: true});
		}
		, hide: function () {
			this.$el.modal('hide');
		}
	})

	MarchMadness.PoolDropdown = Marionette.CompositeView.extend({
		template: "#poolDropDownTemplate"
		, collection: new MarchMadness.Pools()
		, itemView: MarchMadness.PoolDropdownListItem
		, itemViewContainer: "div.currentPools"
		, tagName: "li"
		, className: "dropdown"
		, events: {
			"click #createNewPool": "addCreatePoolForm"
		}
		, initialize: function (){
			this.collection.fetch();
		}
		, addCreatePoolForm: function (e) {
			e.preventDefault();			
			var newPoolForm = new MarchMadness.PoolFormView({
				collection: this.collection
			});
			MarchMadness.layoutInstance.module.show(newPoolForm);
		}
	});


	MarchMadness.on("initialize:after", function () {
		var poolDropDown = new MarchMadness.PoolDropdown();
		MarchMadness.layoutInstance = new MarchMadness.MyLayoutView();

		MarchMadness.layout.show(MarchMadness.layoutInstance);
		MarchMadness.layoutInstance.poolDropdown.show(poolDropDown);
	});

	MarchMadness.start();
});