from django.contrib import admin

from .models import (
    Client,
    ClientEmail,
    ClientPhone,
    ClientProject,
    Material,
    Phase,
    PhaseInterval,
    PhaseMaterial,
    Project,
    QuoteSupplierMaterial,
    QuoteWorker,
    Quotes,
    Supplier,
    SupplierMaterial,
    SupplierPhone,
    Worker,
    WorkerPhone,
)

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("cedula", "name", "address")
    search_fields = ("cedula", "name", "address")

@admin.register(ClientEmail)
class ClientEmailAdmin(admin.ModelAdmin):
    list_display = ("email", "cedula")
    search_fields = ("email", "cedula__name")
    autocomplete_fields = ("cedula",)
    

@admin.register(ClientPhone)
class ClientPhoneAdmin(admin.ModelAdmin):
    list_display = ("phone", "cedula")
    search_fields = ("phone", "cedula")
    autocomplete_fields = ("cedula",)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("project_id", "name", "location")
    search_fields = ("name", "location")

@admin.register(ClientProject)
class ClientProjectAdmin(admin.ModelAdmin):
    list_display = ("cedula", "project_id", "role_name")
    search_fields = ("cedula__name", "project_id__name", "role_name")
    autocomplete_fields = ("cedula", "project_id")

@admin.register(Phase)
class PhaseAdmin(admin.ModelAdmin):
    list_display = ("phase_id", "project_id", "name", "description")
    search_fields = ("name", "project_id__name")
    autocomplete_fields = ("project_id",)

@admin.register(Quotes)
class QuotesAdmin(admin.ModelAdmin):
    list_display = ("quote_id", "phase_id", "quote_date", "description" , "is_first_quote")
    search_fields = ("phase_id__name", "date")
    autocomplete_fields = ("phase_id",)

@admin.register(PhaseInterval)
class PhaseIntervalAdmin(admin.ModelAdmin):
    list_display = ("interval_id", "phase_id", "start_date", "end_date" , "reason")
    search_fields = ("phase_id__name",)
    autocomplete_fields = ("phase_id",)

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("material_id", "name", "category", "description")
    search_fields = ("name",)

@admin.register(PhaseMaterial)
class PhaseMaterialAdmin(admin.ModelAdmin):
    list_display = ("phase_id", "material_id", "unit_price_estimated", "quantity_estimated")
    search_fields = ("phase_id", "material_id")
    autocomplete_fields = ("phase_id", "material_id")

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("nit", "name", "location" , "type" , "bank_account")
    search_fields = ("name", "location")

@admin.register(SupplierPhone)
class SupplierPhoneAdmin(admin.ModelAdmin):
    list_display = ("nit", "phone")
    search_fields = ("phone", "nit__name")
    autocomplete_fields = ("nit",)

@admin.register(SupplierMaterial)
class SupplierMaterialAdmin(admin.ModelAdmin):
    list_display = ("supplier_material_id", "actual_price", "nit", "material_id", "actual_price" , "unit_of_measure")
    search_fields = ("supplier_id__name", "material_id__name")
    autocomplete_fields = ("nit", "material_id")


@admin.register(QuoteSupplierMaterial)
class QuoteSupplierMaterialAdmin(admin.ModelAdmin):
    list_display = ("quote_id", "supplier_material_id", "quantity", "unit_price" , "subtotal")
    search_fields = ("quote_id__phase_id__name", "supplier_id__name", "material_id__name")
    autocomplete_fields = ("quote_id", "supplier_material_id")


@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = ("cedula", "first_name", "last_name")
    search_fields = ("cedula", "first_name", "last_name")


@admin.register(WorkerPhone)
class WorkerPhoneAdmin(admin.ModelAdmin):
    list_display = ("cedula", "phone")
    search_fields = ("phone", "cedula__name")
    autocomplete_fields = ("cedula",)

@admin.register(QuoteWorker)
class QuoteWorkerAdmin(admin.ModelAdmin):
    list_display = ( "quote_worker_id", "quote_id", "cedula" )
    search_fields = ("quote_id__name", "cedula__first_name", "cedula__last_name")
    autocomplete_fields = ("quote_id", "cedula")


