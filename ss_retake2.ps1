Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Kill Edge completely
Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 4

# Open dashboard in InPrivate
Start-Process "msedge" "--inprivate http://localhost:3001"
Start-Sleep -Seconds 7

$wshell = New-Object -ComObject wscript.shell
$wshell.AppActivate('localhost')
Start-Sleep -Milliseconds 500
$wshell.SendKeys('{F11}')
Start-Sleep -Seconds 2

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap.Save("C:\workspaces\credit-loan-system\final_dashboard.png")
$graphics.Dispose()
$bitmap.Dispose()
Write-Output "Saved dashboard"

# Navigate to contract detail in same window
$wshell.SendKeys('{F11}')
Start-Sleep -Seconds 1
$wshell.SendKeys('^l')
Start-Sleep -Milliseconds 300
$wshell.SendKeys('http://localhost:3001/loans/contracts/1{ENTER}')
Start-Sleep -Seconds 5
$wshell.SendKeys('{F11}')
Start-Sleep -Seconds 2

$bitmap2 = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics2 = [System.Drawing.Graphics]::FromImage($bitmap2)
$graphics2.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap2.Save("C:\workspaces\credit-loan-system\final_detail.png")
$graphics2.Dispose()
$bitmap2.Dispose()
Write-Output "Saved detail"

$wshell.SendKeys('{F11}')
Write-Output "Done"
