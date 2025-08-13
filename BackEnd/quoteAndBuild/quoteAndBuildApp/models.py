# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Client(models.Model):
    cedula = models.CharField(primary_key=True, max_length=32)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"
    
class ClientEmail(models.Model):
    cedula = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='emails')
    email = models.EmailField()

    class Meta:
        unique_together = (('cedula', 'email'),)

    def __str__(self):
        return f"{self.email} ({self.cedula})"
    
class ClientPhone(models.Model):
    cedula = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='phones')
    phone = models.CharField(max_length=20)

    class Meta:
        unique_together = (('cedula', 'phone'),)

    def __str__(self):
        return f"{self.phone} ({self.cedula})"
    

class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=160)

    def __str__(self):
        return f"{self.name} ({self.location})"

class ClientProject(models.Model):
    cedula = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='projects')
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='clients')
    role_name = models.CharField(max_length=45)

    class Meta:
        unique_together = (('cedula', 'project_id'),)

    def __str__(self):
        return f"{self.cedula} - {self.project_id} ({self.role_name})"
    
class Phase(models.Model):
    phase_id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='phases')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.project_id})"
    
class Quotes(models.Model):
    quote_id = models.AutoField(primary_key=True)
    phase_id = models.ForeignKey(Phase, on_delete=models.CASCADE, related_name='quotes')
    quote_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    is_first_quote = models.BooleanField()

    def __str__(self):
        return f"Quote {self.quote_id} for {self.project_id} - {self.phase_id}"
    
class PhaseInterval(models.Model):
    interval_id = models.AutoField(primary_key=True)
    phase_id = models.ForeignKey(Phase, on_delete=models.CASCADE, related_name='intervals')
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Interval for {self.phase_id} from {self.start_date} to {self.end_date}"
    
    
class Material(models.Model):
    material_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.category})"
    
class PhaseMaterial(models.Model):
    phase_id = models.ForeignKey(Phase, on_delete=models.CASCADE, related_name='materials')
    material_id = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='phases')
    unit_price_estimated = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_estimated = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = (('phase_id', 'material_id'),)

    def __str__(self):
        return f"{self.material_id} for {self.phase_id} - Quantity: {self.quantity_estimated}"

class Supplier(models.Model):
    nit = models.CharField(primary_key=True , max_length=32)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=160)
    type = models.CharField(max_length=50)
    bank_account = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name}"
    
class SupplierPhone(models.Model):
    nit = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='phones')
    phone = models.CharField(max_length=20)

    class Meta:
        unique_together = (('nit', 'phone'),)

    def __str__(self):
        return f"{self.phone} ({self.nit})"
    
class SupplierMaterial(models.Model):
    supplier_material_id = models.AutoField(primary_key=True)
    nit = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='materials')
    material_id = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='suppliers')
    actual_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_of_measure = models.CharField(max_length=50)

    class Meta:
        unique_together = (('nit', 'material_id'),)

    def __str__(self):
        return f"{self.material_id} from {self.nit}"
    
class QuoteSupplierMaterial(models.Model):
    quote_id = models.ForeignKey(Quotes, on_delete=models.CASCADE, related_name='supplier_materials')
    supplier_material_id = models.ForeignKey(SupplierMaterial, on_delete=models.CASCADE, related_name='quotes')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        unique_together = (('quote_id', 'supplier_material_id'),)

    def __str__(self):
        return f"{self.supplier_material_id} for {self.quote_id} - Quantity: {self.quantity}"
    
class Worker(models.Model):
    cedula = models.CharField(primary_key=True, max_length=32)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} ({self.cedula})"
    
class WorkerPhone(models.Model):
    cedula = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='phones')
    phone = models.CharField(max_length=20)

    class Meta:
        unique_together = (('cedula', 'phone'),)

    def __str__(self):
        return f"{self.phone} ({self.cedula})"
    
class QuoteWorker(models.Model):
    quote_worker_id = models.AutoField(primary_key=True)
    quote_id = models.ForeignKey(Quotes, on_delete=models.CASCADE, related_name='workers')
    cedula = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='quotes')

    class Meta:
        unique_together = (('quote_id', 'cedula'),)

    def __str__(self):
        return f"{self.cedula} for {self.quote_id}"