Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Start-Process "http://localhost:3001/loans/contracts"
Start-Sleep -Seconds 5

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap.Save('C:\workspaces\credit-loan-system\ss_contracts2.png')
$graphics.Dispose()
$bitmap.Dispose()
Write-Output 'Done'
