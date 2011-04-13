$PATH = Split-Path -parent $MyInvocation.MyCommand.Definition
$global:CFG_ROOT = $PATH + "\war\WEB-INF\"
$global:CFG_DIR = $CFG_ROOT + "configs\"
$global:ENV = @("dev\", "test\", "prod\")


function copyConfig {
	param([int]$i = 0)
	
	$cfg_path = $global:CFG_DIR + $global:ENV[$i] + "\*"
		
	copy-item $cfg_path $global:CFG_ROOT
}

function main {
	$choiceList = @("&0. Cancel", "&1. Developer", "&2. Test", "&3. Production")
	$caption = "Change enviroment";
	$message = "What enviroment do you want?";
		
	$choicedesc = New-Object System.Collections.ObjectModel.Collection[System.Management.Automation.Host.ChoiceDescription] 
   	$choiceList | foreach  { $choicedesc.Add((New-Object "System.Management.Automation.Host.ChoiceDescription" -ArgumentList $_))} 

   	$answer = $Host.ui.PromptForChoice($caption, $message, $choicedesc, 0) 
   
	switch ($answer){
    	{ $_ -gt 0 } { copyConfig ($answer - 1) }
	}	
}

cls
main